
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDb } from "./db.js";
import { requireAuth } from "./middleware/requireAuth.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

const port = process.env.PORT || 5000;

const validId = (id) => ObjectId.isValid(id);

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "StudioSpace API",
  });
});

// Local development bridge
app.post("/api/auth/session", (req, res) => {
  const { email, name } = req.body || {};

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  const token = jwt.sign(
    {
      email,
      name: name || email.split("@")[0],
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.cookie("studio_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.json({ message: "Session cookie created" });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("studio_token");
  res.json({ message: "Logged out" });
});

// Get all studios
app.get("/api/studios", async (req, res) => {
  try {
    const db = await getDb();
    const { category, q } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    const items = await db.collection("studios")
      .find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .limit(100)
      .toArray();

    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get studios by owner
app.get("/api/studios/owner/:email", async (req, res) => {
  try {
    const db = await getDb();

    res.json(
      await db.collection("studios")
        .find({ ownerEmail: req.params.email })
        .sort({ createdAt: -1 })
        .toArray()
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get single studio
app.get("/api/studios/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid studio id",
      });
    }

    const db = await getDb();

    const item = await db.collection("studios").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!item) {
      return res.status(404).json({
        message: "Studio not found",
      });
    }

    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Create studio
app.post("/api/studios", requireAuth, async (req, res) => {
  try {
    const body = req.body;

    const required = [
      "title",
      "category",
      "location",
      "image",
      "overview",
    ];

    for (const k of required) {
      if (!body[k]) {
        return res.status(400).json({
          message: `${k} is required`,
        });
      }
    }

    const db = await getDb();

    const doc = {
      ...body,
      ownerEmail: req.user.email,
      ownerName: req.user.name || req.user.email,
      createdAt: new Date(),
      rating: 0,
      reviewsCount: 0,
      reviews: [],
      gallery: body.gallery || [],
    };

    const result = await db.collection("studios").insertOne(doc);

    res.status(201).json({
      ...doc,
      _id: result.insertedId,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update studio
app.patch("/api/studios/:id", requireAuth, async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid studio id",
      });
    }

    const db = await getDb();
    const col = db.collection("studios");

    const current = await col.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!current) {
      return res.status(404).json({
        message: "Studio not found",
      });
    }

    if (current.ownerEmail !== req.user.email) {
      return res.status(403).json({
        message: "You can only update your own listing",
      });
    }

    const { $set, ...safe } = req.body;

    delete safe._id;
    delete safe.ownerEmail;
    delete safe.ownerName;

    await col.updateOne(
      { _id: current._id },
      {
        $set: {
          ...safe,
          updatedAt: new Date(),
        },
      }
    );

    res.json(await col.findOne({ _id: current._id }));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete studio
app.delete("/api/studios/:id", requireAuth, async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid studio id",
      });
    }

    const db = await getDb();
    const col = db.collection("studios");

    const current = await col.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!current) {
      return res.status(404).json({
        message: "Studio not found",
      });
    }

    if (current.ownerEmail !== req.user.email) {
      return res.status(403).json({
        message: "You can only delete your own listing",
      });
    }

    await col.deleteOne({ _id: current._id });

    res.json({ message: "Studio deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Convert time into minutes
function minutes(t) {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
}

// Validate time format (HH:mm)
function isValidTime(time) {
  return (
    typeof time === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  );
}

// Validate date format (YYYY-MM-DD)
function isValidDate(date) {
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

// Create Booking - Only logged-in users
app.post("/api/bookings", requireAuth, async (req, res) => {
  try {
    const {
      studioId,
      date,
      startTime,
      endTime,
    } = req.body;

    if (
      !validId(studioId) ||
      !isValidDate(date) ||
      !isValidTime(startTime) ||
      !isValidTime(endTime)
    ) {
      return res.status(400).json({
        message: "Please provide valid booking details",
      });
    }

    if (minutes(endTime) <= minutes(startTime)) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    const db = await getDb();

    const studio = await db.collection("studios").findOne({
      _id: new ObjectId(studioId),
    });

    if (!studio) {
      return res.status(404).json({
        message: "Studio not found",
      });
    }

    const clashes = await db.collection("bookings")
      .find({
        studioId,
        date,
        status: "Confirmed",
      })
      .toArray();

    const overlap = clashes.some(
      (b) =>
        minutes(startTime) < minutes(b.endTime) &&
        minutes(endTime) > minutes(b.startTime)
    );

    if (overlap) {
      return res.status(409).json({
        message: "This time slot is already booked. Please choose another time.",
      });
    }

    const hours =
      (minutes(endTime) - minutes(startTime)) / 60;

    const doc = {
      studioId,
      studioTitle: studio.title,
      studioImage: studio.image,
      guestName: req.user.name || req.user.email,
      guestEmail: req.user.email,
      ownerEmail: studio.ownerEmail,
      date,
      startTime,
      endTime,
      hours,
      totalPrice: hours * Number(studio.hourlyRate),
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(doc);

    res.status(201).json({
      ...doc,
      _id: result.insertedId,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// My Bookings
app.get("/api/bookings/guest/:email", requireAuth, async (req, res) => {
  try {
    if (
      req.params.email.toLowerCase() !==
      req.user.email.toLowerCase()
    ) {
      return res.status(403).json({
        message: "You can only view your own bookings",
      });
    }

    const db = await getDb();

    const bookings = await db.collection("bookings")
      .find({ guestEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Cancel Booking
app.patch("/api/bookings/:id/cancel", requireAuth, async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid booking id",
      });
    }

    const db = await getDb();

    const result = await db.collection("bookings").updateOne(
      {
        _id: new ObjectId(req.params.id),
        guestEmail: req.user.email,
        status: "Pending",
      },
      {
        $set: { status: "Cancelled" },
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({
        message: "Pending booking not found",
      });
    }

    res.json({ message: "Booking cancelled" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.listen(port, () => {
  console.log(`StudioSpace API running on http://localhost:${port}`);
});
