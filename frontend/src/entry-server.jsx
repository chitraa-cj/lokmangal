// frontend/src/entry-server.jsx
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";
import axios from "axios";

// Function to fetch article data and render the app
export async function render(url, context) {
  console.log(`[SSR] Rendering URL: ${url}`);

  let title = "The Lok Mangal News";
  let description = "Read the latest news on The Lok Mangal News";
  let ogImage = "https://thelokmangal.com/default-image.jpg";
  let ogUrl = "https://thelokmangal.com";
  let ogType = "website";

  // Check if the URL matches /api/news/:type/:id
  const newsRouteMatch = url.match(/\/api\/news\/([^/]+)\/([^/]+)/);
  if (newsRouteMatch) {
    const [, type, id] = newsRouteMatch;
    console.log(`[SSR] Detected news route: type=${type}, id=${id}`);

    try {
      // Fetch article data from the backend
      const response = await axios.get(
        `http://localhost:5000/api/news/${type}/${id}`
      );
      const article = response.data;
      console.log(`[SSR] Fetched article: ${article.title}`);

      // Set metadata for the article
      title = article.title || title;
      description = article.conclusion || description;
      ogImage = article.imgUrl || ogImage;
      ogUrl = `https://thelokmangal.com/api/news/${type}/${id}`;
      ogType = "article";
    } catch (error) {
      console.error(`[SSR] Error fetching article: ${error.message}`);
      context.status = 404; // Set status for error handling
    }
  }

  // Render the app with StaticRouter
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  // Return the rendered HTML and metadata
  return {
    appHtml,
    meta: {
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl,
      ogType,
      twitterCard: "summary_large_image",
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
    },
  };
}
