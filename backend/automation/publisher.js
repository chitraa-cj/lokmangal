// Publishes a rewritten article directly to MongoDB via the News model,
// attributed to a configured site user (the same shape createNewsPost produces).
import News from "../models/NewsSchema.js";
import User from "../models/userModel.js";
import { env } from "./config.js";

let cachedAuthor = null;

// Resolve the author user once: configured username > any admin > first user.
export async function resolveAuthor() {
  if (cachedAuthor) return cachedAuthor;
  let user = null;
  if (env.authorUsername) {
    user = await User.findOne({ username: env.authorUsername }).lean();
  }
  if (!user) user = await User.findOne({ isAdmin: true }).lean();
  if (!user) user = await User.findOne().lean();
  if (!user) {
    throw new Error(
      "No user found to attribute autopilot posts to. Seed a user or set AUTOPILOT_AUTHOR_USERNAME."
    );
  }
  cachedAuthor = user;
  console.log(`[autopilot] publishing as user "${user.username}" (${user.name})`);
  return user;
}

// Insert a rewritten article. Returns the created News document.
export async function publishArticle(rewritten, imgUrl) {
  const author = await resolveAuthor();
  const post = new News({
    user: author._id,
    userName: author.name,
    articleType: rewritten.articleType,
    title: rewritten.title,
    conclusion: rewritten.conclusion,
    imgUrl,
    content: rewritten.content,
    navbarCategories: rewritten.navbarCategories,
    hashtags: rewritten.hashtags,
    footerTags: rewritten.footerTags,
  });
  return post.save();
}
