const { fetchJson } = require("../lib/functions");
const { facebook } = require("@mrnima/facebook-downloader");
const axios = require("axios");
const { cmd, commands } = require('../command');

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("*Need a valid Facebook URL!*");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = https://lance-frank-asta.onrender.com/api/downloader?url=${encodeURIComponent(q)};
    const { data } = await axios.get(apiUrl);

    if (!data?.content?.status || !data?.content?.data?.result?.length) {
      throw new Error("Invalid API response or no video found.");
    }

    let videoData = data.content.data.result.find(v => v.quality === "HD") || 
                    data.content.data.result.find(v => v.quality === "SD");

    if (!videoData) {
      throw new Error("No valid video URL found.");
    }

    await conn.sendMessage(from, {
      video: { url: videoData.url },
      caption: 📥 *Downloaded in ${videoData.quality} Quality*\n\n> > © 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚢 𝙼𝙰𝙳𝚄𝚂𝙰𝙽𝙺𝙰 𝙼𝙳
    }, { quoted: m });

  } catch (error) {
    console.error("FB Download Error:", error);

    // Send error details to bot owner
    const ownerNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerNumber, {
      text: ⚠️ *FB Downloader Error!*\n\n📍 *Group/User:* ${from}\n💬 *Query:* ${q}\n❌ *Error:* ${error.message || error}
    });

    // Notify the user
    reply("❌ *Error:* Unable to process the request. Please try again later.");
  }
});