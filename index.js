const express = require('express');
const admin = require('firebase-admin');
const app = express();
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post('/sendNotification', async (req, res) => {
  const { token, callerName } = req.body;

  const message = {
    token,
    notification: {
      title: `Incoming Call`,
      body: `${callerName} is calling you`
    },
    data: {
      type: "video_call",
      callerName,
    }
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send({ success: true, messageId: response });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
