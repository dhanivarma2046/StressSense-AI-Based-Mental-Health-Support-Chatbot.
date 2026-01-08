const chatArea = document.getElementById("chatBox");
const scoreDisplay = document.getElementById("stressScore");
const labelDisplay = document.getElementById("stressLabel");
const helpList = document.getElementById("resources");
const moodIcon = document.getElementById("statusIcon");

let conversationStage = "start";
let lastEmotion = "";

const greetings = [
  "Hi, I’m here with you. How are you feeling today?",
  "Hello 🙂 Want to share what’s been on your mind?",
  "I’m listening. What’s been bothering you lately?"
];

function sendMessage() {
  const text = document.getElementById("userInput").value.trim();
  if (!text) return;

  chatArea.innerHTML += `<div class="message user">${text}</div>`;
  chatArea.scrollTop = chatArea.scrollHeight;

  const score = analyzeEmotion(text);
  updateDashboard(score);

  const reply = generateReply(score);
  showBotMessage(reply);

  document.getElementById("userInput").value = "";
}

function analyzeEmotion(message) {
  let score = 0;
  const text = message.toLowerCase();

  const emotions = {
    calm: ["okay", "fine", "relaxed", "peaceful"],
    mild: ["tired", "busy", "worried", "confused"],
    high: ["anxious", "panic", "overwhelmed", "burnout", "cry"],
    critical: ["hopeless", "worthless", "give up", "depressed"]
  };

  Object.entries(emotions).forEach(([level, words]) => {
    words.forEach(word => {
      if (text.includes(word)) {
        lastEmotion = word;
        score += level === "calm" ? 5 :
                 level === "mild" ? 15 :
                 level === "high" ? 30 : 50;
      }
    });
  });

  if (text.includes("!")) score += 10;
  return Math.min(score, 100);
}

function generateReply(score) {
  if (conversationStage === "start") {
    conversationStage = "listening";
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (score < 30)
    return "That sounds fairly calm. What’s something that helped you feel this way today?";

  if (score < 60)
    return "I sense some stress. Is it related to work, studies, or something personal?";

  if (score < 85)
    return "Thank you for opening up. When did you start feeling like this?";

  return "You matter. Please consider reaching out to someone you trust or a mental health professional.";
}

function updateDashboard(score) {
  scoreDisplay.innerText = score;
  helpList.innerHTML = "";

  if (score < 30) {
    labelDisplay.innerText = "Calm";
    moodIcon.src = "calm.png";
    addHelp("Maintain your routine");
    addHelp("Practice gratitude");

  } else if (score < 60) {
    labelDisplay.innerText = "Moderate Stress";
    moodIcon.src = "stress.png";
    addHelp("Try slow breathing");
    addHelp("Take a short break");

  } else if (score < 85) {
    labelDisplay.innerText = "High Stress";
    moodIcon.src = "stress.png";
    addHelp("Ground yourself (5-4-3-2-1)");
    addHelp("Reduce screen time");

  } else {
    labelDisplay.innerText = "Critical";
    moodIcon.src = "critical_alert.png";
    addHelp("Reach out to a counselor");
    addHelp("Contact emergency support if needed");
  }
}

function addHelp(text) {
  helpList.innerHTML += `<li>${text}</li>`;
}

function showBotMessage(text) {
  let i = 0;
  const msgDiv = document.createElement("div");
  msgDiv.className = "message bot";
  chatArea.appendChild(msgDiv);

  const typing = setInterval(() => {
    msgDiv.textContent += text.charAt(i);
    i++;
    chatArea.scrollTop = chatArea.scrollHeight;
    if (i === text.length) clearInterval(typing);
  }, 30);
}
