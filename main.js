const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audio = document.getElementById('backgroundMusic');
const consoleElement = document.getElementById('console');

let debugMode = false; // 在这里开debugmode！！

let audioContext;
let analyser;
let userInputMode = false;
let currentInput = '';

const textLines = [
    "Initializing System...",
    "------------------------------",  // 直接显示
    "> Authenticating User...",
    "> Username: xxhyz",
    "> Verify Identity [y/n]?"
];

const responseLines = [
    "Identity Verified. Welcome, xxhyz.",
    "",
    "------------------------------",  // 直接显示
    "> Checking System Health...",
    "",
    "> Memory Status: Optimal",
    "> CPU Load: Nominal",
    "> Network: Secure",
    "> Database Connection: Stable",
    "> Security Protocols: Active",
    "",
    "------------------------------",  // 直接显示
    "> User Registration Date: 20 years ago",
    "> Event Reminder: Special Milestone Reached - Congratulations!",
    "",
    "User Authentication Successful.",
    "Access Level: Full Control",
    "",
    "> Preparing Interface...",
    "",
    "Press [Enter] to Begin..."
];

let lineIndex = 0;
let charIndex = 0;
let responseLineIndex = 0;
let responseCharIndex = 0;

const moonFrames = ["◰", "◳", "◲", "◱"];

let moonIndex = 0;
let moonAnimationDuration = 2000;
let moonAnimationStartTime;
let cursorVisible = true;

function showBlinkingCursor(duration, callback) {
    consoleElement.innerHTML += '<span id="cursor" style="color: white;">|</span>';
    let blinkInterval = setInterval(() => {
        cursorVisible = !cursorVisible;
        document.getElementById('cursor').style.visibility = cursorVisible ? 'visible' : 'hidden';
    }, 500);

    setTimeout(() => {
        clearInterval(blinkInterval);
        document.getElementById('cursor').remove();
        callback();
    }, duration);
}

function showLoadingAnimation() {
    const currentTime = new Date().getTime();
    if (currentTime - moonAnimationStartTime < moonAnimationDuration) {
        consoleElement.innerHTML = `<span style="color: white;">${moonFrames[moonIndex]}</span>`;
        moonIndex = (moonIndex + 1) % moonFrames.length;
        setTimeout(showLoadingAnimation, 100);
    } else {
        consoleElement.innerHTML = '';
        showBlinkingCursor(500, typeEffect);
    }
}

function typeEffect() {
    if (debugMode) {
        // 在调试模式下，直接显示所有文本
        textLines.forEach(line => {
            consoleElement.innerHTML += `<span style="color: white;">${line}</span><br>`;
        });
        userInputMode = true;
        handleUserInput();
        return;
    }
    if (lineIndex < textLines.length) {
        const currentLine = textLines[lineIndex];
        // 如果是直线行，直接显示并跳过光标
        if (currentLine.includes("------------------------------")) {
            consoleElement.innerHTML += `<span style="color: white;">${currentLine}</span><br>`;
            lineIndex++;
            // 如果到达最后一行，启用用户输入模式
            if (lineIndex === textLines.length) {
                userInputMode = true;
                handleUserInput();
            } else {
                setTimeout(typeEffect, 300); // 直接显示后延迟300毫秒继续
            }
        } else if (charIndex < currentLine.length) {
            // 如果是 "Identity Verified. Welcome, xxhyz." 这一行，保留打字机效果但不显示光标
            if (currentLine === "Identity Verified. Welcome, xxhyz.") {
                consoleElement.innerHTML += `<span style="color: white;">${currentLine[charIndex]}</span>`;
                charIndex++;
                setTimeout(typeEffect, 20); // 继续显示字符
            } else {
                consoleElement.innerHTML += `<span style="color: white;">${currentLine[charIndex]}</span>`;
                charIndex++;
                setTimeout(typeEffect, 20);
            }
        } else {
            consoleElement.innerHTML += '<br>';
            charIndex = 0;
            lineIndex++;
            if (lineIndex === textLines.length) {
                userInputMode = true;
                handleUserInput();
            } else if (textLines[lineIndex] === "Identity Verified. Welcome, xxhyz.") {
                setTimeout(typeEffect, 0); // 没有光标，继续下一个
            } else {
                setTimeout(() => showBlinkingCursor(1000, typeEffect), 300); // 显示光标后继续
            }
        }
    }
}

function typeResponseEffect() {
    if (debugMode) {
        // 在调试模式下，直接显示所有响应文本
        responseLines.forEach(line => {
            const lineStyle = line.includes("User Registration Date:") || line.includes("Event Reminder:")
                ? 'color: #0f0;'
                : 'color: white;';
            consoleElement.innerHTML += `<span style="${lineStyle}">${line}</span><br>`;
        });
        waitForEnterKey();
        return;
    }
    if (responseLineIndex < responseLines.length) {
        const currentLine = responseLines[responseLineIndex];
        // 如果是直线行，直接显示并跳过光标
        if (currentLine.includes("------------------------------")) {
            consoleElement.innerHTML += `<span style="color: white;">${currentLine}</span><br>`;
            responseLineIndex++;
            setTimeout(typeResponseEffect, 300); // 直接显示后延迟300毫秒继续
        } else if (responseCharIndex < currentLine.length) {
            const lineStyle = currentLine.includes("User Registration Date:") || currentLine.includes("Event Reminder:")
                ? 'color: #0f0;'
                : 'color: white;';
            consoleElement.innerHTML += `<span style="${lineStyle}">${currentLine[responseCharIndex]}</span>`;
            responseCharIndex++;
            setTimeout(typeResponseEffect, 20);
        } else {
            consoleElement.innerHTML += '<br>';
            responseCharIndex = 0;
            responseLineIndex++;
            if (responseLines[responseLineIndex] === "Identity Verified. Welcome, xxhyz.") {
                setTimeout(typeResponseEffect, 0); // 没有光标，继续下一个
            } else {
                setTimeout(() => showBlinkingCursor(500, typeResponseEffect), 300); // 显示光标，等待0.5秒，然后继续显示下一行
            }
        }
    } else {
        waitForEnterKey(); // 在响应结束后等待用户按下 Enter 键
    }
}

function handleEnterPress(event) {
    if (event.key === 'Enter') {
        const originalText = consoleElement.innerText; // 保存原始文本
        let corruptedText = originalText.split(''); // 将原始文本转换为字符数组
        let hiddenMessage = 'I love you'; // 要隐藏的消息
        const duration = 3000; // 三秒内完成
        const interval = 5;
        let messageInserted = false; // 标记消息是否已插入
        let remainingTime = duration; // 剩余时间
        const lineThreshold = 5;

        // 创建一个间隔来逐字符替换为随机字符并逐步删除字符
        const corruptionInterval = setInterval(() => {
            if (remainingTime > 0) {
                const lines = corruptedText.join('').split('\n');
                // 插入隐藏消息
                if (!messageInserted && Math.random() < 0.4 && hiddenMessage.length > 0) { // 10% 概率插入一个隐藏字符
                    let insertPosition = Math.floor(Math.random() * corruptedText.length);
                    corruptedText[insertPosition] = hiddenMessage[0];
                    hiddenMessage = hiddenMessage.slice(1); // 移除已插入的字符
                    messageInserted = hiddenMessage.length === 0; // 如果消息全部插入，则标记为已完成
                } else {
                    // 生成随机字符并替换原始文本的一个字符
                    let randomChar = String.fromCharCode(Math.floor(Math.random() * (126 - 33) + 33)); // 随机生成字符
                    let replacePosition = Math.floor(Math.random() * corruptedText.length); // 随机选择一个位置替换
                    corruptedText[replacePosition] = randomChar;
                }

                // 如果剩余行数超过阈值，继续逐字符删除
                if (lines.length > lineThreshold) {
                    corruptedText.shift(); // 逐个删除字符
                } else {
                    // 当剩余行数小于阈值时，按行删除
                    corruptedText = corruptedText.join('').split('\n'); // 转换为行
                    corruptedText.shift(); // 删除整行
                    corruptedText = corruptedText.join('\n').split(''); // 再次转换为字符数组
                }
                // 更新显示
                consoleElement.innerText = corruptedText.join('');
        remainingTime -= interval; // 减少剩余时间
            } else {
                clearInterval(corruptionInterval);
                setTimeout(() => {
                    consoleElement.style.display = 'none'; // 隐藏命令行文字

                    // 显示便利签
                    showStickyNote();

                    // 创建 AudioContext
                    if (!audioContext) {
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        analyser = audioContext.createAnalyser();
                        const audioSource = audioContext.createMediaElementSource(audio);
                        audioSource.connect(analyser);
                        analyser.connect(audioContext.destination);
                        analyser.fftSize = 256;
                        audio.volume = 0.5; // 设置音量为50%
                    }

                    setTimeout(() => {
                        audio.play();
                        drawVisualizer();
                    }, 500); // 延迟 500 毫秒后播放音频和启动可视化效果

                }, 1000); // 等待 1 秒钟后隐藏命令行文字
            }
        }, interval); // 每隔 `interval` 毫秒进行一次操作

        document.removeEventListener('keydown', handleEnterPress);
    }
}

function showStickyNote() {
    const stickyNote = document.getElementById('sticky-note');

    // 重置动画属性以确保每次都能触发动画
    stickyNote.style.display = 'none';
    stickyNote.style.animation = 'none';

    setTimeout(() => {
        stickyNote.style.display = 'block'; // 显示便利签
        stickyNote.style.animation = 'slideIn 1s ease-out forwards'; // 在1秒延迟后启动滑入动画
    }, 1000); // 1秒后显示并触发滑入动画
}

function scaleDownStickyNote() {
    document.getElementById('sticky-note').style.display = 'none';
    document.getElementById('sticky-note-small').style.display = 'block';
}

window.scaleDownStickyNote = scaleDownStickyNote;

function expandStickyNote() {
    // 隐藏缩小版本
    const stickyNoteSmall = document.getElementById('sticky-note-small');
    const stickyNote = document.getElementById('sticky-note');
    
    stickyNoteSmall.style.display = 'none'; // 隐藏小版本便利贴
    stickyNote.style.display = 'block';     // 显示完整版本便利贴
    
    // 移除动画样式，避免再次触发滑入效果
    stickyNote.style.animation = 'none';    // 移除滑入动画
}

window.expandStickyNote = expandStickyNote;

function hideStickyNote() {
    const stickyNote = document.getElementById('sticky-note');
    stickyNote.style.display = 'none'; // 隐藏便利签
}

function handleUserInput() {
    if (userInputMode) {
        consoleElement.innerHTML += '<span style="color: white;">> </span>';
        document.addEventListener('keydown', processUserInput);
    }
}

function processUserInput(event) {
    if (userInputMode) {
        if (event.key === 'Enter') {
            if (currentInput.trim().toLowerCase() === 'y') {
                userInputMode = false;
                const lines = consoleElement.innerHTML.split('<br>');
                lines[lines.length - 1] = '<span style="color: white;">> y</span>';
                consoleElement.innerHTML = lines.join('<br>') + '<br>';
                currentInput = '';
                document.removeEventListener('keydown', processUserInput);
                proceedAfterInput();
            } else {
                consoleElement.innerHTML += '<br><span style="color: white;">Invalid input. Please enter [y/n]: </span>';
                currentInput = '';
            }
        } else if (event.key.length === 1) {
            currentInput += event.key;
            consoleElement.innerHTML += `<span style="color: white;">${event.key}</span>`;
        }
    }
}

function proceedAfterInput() {
    responseLineIndex = 0;  // 重置响应行索引
    responseCharIndex = 0;  // 重置响应字符索引
    showBlinkingCursor(100, typeResponseEffect); // 显示光标，等待1秒，然后启动响应键入动画
}

function waitForEnterKey() {
    consoleElement.innerHTML += '<span style="color: white;">> </span>';
    currentInput = ''; // 清空输入
    document.addEventListener('keydown', handleEnterPress); // 等待用户按下 Enter 键
}

function drawVisualizer() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const pixelSize = Math.floor(canvas.width / 100);
  const spacing = 0;
  const numColumns = Math.floor(canvas.width / (pixelSize + spacing));
  const numRows = Math.floor(canvas.height / (pixelSize + spacing));

  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numColumns; col++) {
          const index = (row * numColumns + col) % bufferLength;
          const barHeight = dataArray[index];
          const color = `rgba(${barHeight + 100}, ${barHeight * 2}, 255, ${barHeight / 255})`;

          ctx.fillStyle = color;
          ctx.fillRect(
              col * (pixelSize + spacing), 
              row * (pixelSize + spacing), 
              pixelSize, 
              pixelSize
          );
      }
  }

  requestAnimationFrame(drawVisualizer);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 以下为情书内容
// 定义时间戳
const effectTextBlocks = [

    { time: 15.00, text: "...Loading..."},

    { time: 29.25, text: "------------"},

    { time: 31.17, text: "Let us go then, you and I,\nWhile the dusk settles between Brooklyn's towering spires\nLet us go, through certain cold streets,\nFeeling the East River wind drift softly by," },
    
    { time: 38.50, text: "The night slithers near, of insidious intent\nTo lead you to an overwhelming question ...\nBut do not ask, “What is it?”\nLet us go and make our visit." },
    
    { time: 46.03, text: "Siren lights brushing the windows,\nSmoke of cannabis lingering in alleyways,\nLicked its tongue into distant echoes from Washington Square,\nLingered upon the neon pooling in wet pavement at corners;" },
    
    { time: 53.23, text: "Steam rising slow from the subway grates,\nSlipped by the terrace, made a sudden leap,\nAs we walk through this early autumn night,\nTender, yet suffocating with an unseen weight." },
    
    { time: 61.00, text: "And indeed there will be time,\nTo pause before 370 Jay St,\nTo catch a glimpse of our faces\nfaintly flickering in the glass;" },
    
    { time: 68.12, text: "Time enough to weigh your thoughts, and to weigh mine,\nTime to hover between a hundred futures,\nonly to undo them all,\nAnd then brew the coffee, break the toast." },
    
    { time: 75.60, text: "And indeed there will be time\nTo wonder, “Do I dare?” and, “Do I dare?”\nTime enough to turn back\nand walk along the river's quiet benches," },
    
    { time: 83.09, text: "Do I dare\nStep into your world?\nAnd indeed there will be time\nTo think, to shift, to hesitate, even for a fleeting second only to shift back again." },
    
    { time: 90.00, text: "..." },
    
    { time: 109.25, text: "For I have known them all already, known them all:\nHave seen each Brooklyn street in the cool night, the first threads of morning,\nHave dissected life into subway encounters;\nHave known the murmured words, the fragments of art and vision,\nHiding in the cracks of our conversations about minds, wounds, and dreams.\nSo how should I presume?" },
    
    { time: 123.25, text: "And I have known the eyes already, known them all—\nThose piercing eyes that strip me bare,\nAnd when I am pinned, wriggling beneath your gaze,\nCaught within your silent inquiry,\nWhat then shall I say\nOf the thoughts, fragile remnants, that fall away unspoken?\nSo how could I presume?\nHow could I find words to speak to you?" },
    
    { time: 138.25, text: "And the afternoon, the evening, sleeps so peacefully!\nSmoothed by long fingers,\nAsleep ... tired ... or it malingers,\nStretched on the floor, here beside you and me.\nYet, after the coffee is drained, the toast devoured, and talk of your latest artwork drifts off,\nWill I still have the courage to push this stillness to its inevitable edge?" },
    
    { time: 153.23, text: "I am no prophet — and here’s no great matter;\nI have seen the unsaid words hover in the air,\nI have seen your expression flicker beneath the streetlamps,\nAnd you merely laughed, softly, with a hint of mockery.\nAnd in short, I was afraid." },
    
    { time: 168.04, text: "And would it have been worth it, after all,\nIs it worth it,\nTo cross the streets of Manhattan, to walk by the East River’s edge,\nTo speak of the distance between you and me—\nAfter this time, and all the times before?—\nI have never been able to say what I meant." },
    
    { time: 182.17, text: "If you ever, by chance, feel a flicker of curiosity,\nAbout those who quietly watch,\nThose shadows standing at the edge of your world,\nRemember that I was there.\nI am the one who watched as you passed through the shadows,\nYour hands dipped in the embers of the night,\nTurning them to stars.\nAnd I, merely the one who, when you walked through those shadows,\nHeld my breath, and marveled from afar." },
    
    { time: 198.07, text: "Inspired by T.S. Eliot\nHappy birthday, xxhyz." }
];

// 打字机效果的函数
function typeWriterForEffect(text, elementId, speed = 20) {
    let index = 0;
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID ${elementId} not found`);
        return;
    }
    element.innerHTML = ''; // 清空之前的内容
    element.style.display = 'block'; // 显示元素
    const interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index) === '\n' ? '<br>' : text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, speed);
}

// Select the beep sound audio element
const beepSound = document.getElementById('beep-sound');

// Function to play the beep sound
function playBeep() {
    if (beepSound) {  // Ensure beepSound exists
        beepSound.currentTime = 0;  // Rewind the sound to the start
        setTimeout(() => {
            beepSound.play();  // Play the beep after a delay of 500ms
        }, 200);  // delay
    }
}

// 整合的基于音乐播放的文字显示
let currentBlockIndex = 0; // 当前文本块的索引

function checkMusicTime() {
    const currentTime = audio.currentTime;
    // console.log("Current time:", currentTime); // 输出当前的音乐播放时间

    if (currentBlockIndex < effectTextBlocks.length) {
        const block = effectTextBlocks[currentBlockIndex];
        // console.log("Next block time:", block.time);  // 输出下一个文本块的时间戳

        // 如果音乐的当前时间达到了文本块的时间戳
        if (currentTime >= block.time) {
            //console.log("Displaying text:", block.text); // 调试信息，确认正在显示文本
            typeWriterForEffect(block.text, 'letter', 25); // 显示当前的文本块
            playBeep();
            currentBlockIndex++; // 显示完后，索引增加，检查下一个文本块
        }
    }

    if (currentBlockIndex < effectTextBlocks.length) {
        requestAnimationFrame(checkMusicTime);
    }
}

// 初始化函数，在音乐播放时启动文本显示
function initTypewriterEffect() {
    // 当音乐开始播放时，启动文本显示的检查
    audio.addEventListener('play', () => {
        currentBlockIndex = 0; // 每次播放重置索引
        requestAnimationFrame(checkMusicTime);
    });
}

function createMoon() {
    const moon = document.createElement('div');
    moon.classList.add('moon');
    moon.style.backgroundImage = 'url("public/pixelmoon.png")'; 
    moon.style.backgroundSize = 'cover';
    moon.style.imageRendering = 'pixelated'; 
    moon.style.opacity = '0';  // Initially hidden
    moon.style.transition = 'opacity 2s ease-in-out, transform 2s ease-in-out';  // Smooth transition for both opacity and potential shape
    document.getElementById('sky').appendChild(moon);

    setTimeout(() => {
        moon.style.opacity = '1';  // Fade-in effect after a delay
    }, 500);  // Delay for the moon to start appearing
}


function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = Math.random() * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.imageRendering = 'pixelated';  // Ensure the stars look pixelated
    document.getElementById('sky').appendChild(star);
}
function generateStars(numStars) {
    for (let i = 0; i < numStars; i++) {
        createStar();
    }
}

function updateMoonPosition() {
    const moon = document.querySelector('.moon');
    const progress = audio.currentTime / audio.duration; // Calculate progress based on audio duration
    const radiusX = window.innerWidth / 3;  // Horizontal radius of the arc
    const radiusY = window.innerHeight / 4; // Vertical radius of the arc

    // Calculate the center of the arc (adjust based on where you want the moon to move)
    const centerX = window.innerWidth / 2; // Center of the screen horizontally
    const centerY = window.innerHeight / 2; // Center of the screen vertically

    // Adjust the angle to follow a natural left-to-right arc
    const angle = progress * Math.PI;  // Move through half of a circle

    // Fix direction: Reverse the sign of cos() to move left-to-right
    const newX = centerX - radiusX * Math.cos(angle);   // Horizontal position (left to right)
    const newY = centerY - radiusY * Math.sin(angle);   // Vertical position (bottom to top)
    //console.log('newX:', newX, 'newY:', newY);

    // Set the new position of the moon
    moon.style.left = `${newX}px`;
    moon.style.top = `${newY}px`;

    // Optional: Rotate the moon as it moves
    moon.style.transform = `rotate(${progress * 360}deg)`;
}

audio.addEventListener('timeupdate', () => {
    const moon = document.querySelector('.moon');
    const progress = audio.currentTime / audio.duration; // 计算播放进度
    moon.style.left = (progress * window.innerWidth) + 'px'; // 根据播放进度移动月亮
});

audio.addEventListener('timeupdate', updateMoonPosition);

let notepad = document.getElementById('notepad');
let notepadContent = document.getElementById('notepad-content');
let lastSyncedIndex = 0; // Keep track of last synced text block

// Show the notepad when the music starts playing
audio.addEventListener('play', () => {
    notepad.style.display = 'block'; // Show the notepad
    lastSyncedIndex = 0; // Reset the sync index
    requestAnimationFrame(syncNotepad); // Start syncing
});

// Syncing the text blocks with music time
function syncNotepad() {
    const currentTime = audio.currentTime;

    // Append text from effectTextBlocks only when time is right
    while (lastSyncedIndex < effectTextBlocks.length && currentTime >= effectTextBlocks[lastSyncedIndex].time) {
        notepadContent.value += effectTextBlocks[lastSyncedIndex].text + '\n';
        lastSyncedIndex++;
    }

    // Keep syncing while the audio is playing
    if (!audio.paused) {
        requestAnimationFrame(syncNotepad);
    }
}

// Function to scale down the notepad
function scaleDownNotepad() {
    document.getElementById('notepad').style.display = 'none'; // Hide the full notepad
    document.getElementById('notepad-small').style.display = 'block'; // Show the small notepad
}

// Function to expand the notepad back to its full size
function expandNotepad() {
    document.getElementById('notepad-small').style.display = 'none'; // Hide the small notepad
    document.getElementById('notepad').style.display = 'block'; // Show the full notepad
}

// Attach the scale down functionality to the notepad's close button (or any other button)
document.querySelector('#notepad .title-bar .close').addEventListener('click', scaleDownNotepad);

function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, initialMouseX = 0, initialMouseY = 0;

    const header = element.querySelector('.title-bar');
    
    // Mouse down event to start the drag
    header.onmousedown = function(e) {
        e.preventDefault();

        // Get the initial mouse position and element's offset
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;

        offsetX = element.offsetLeft;
        offsetY = element.offsetTop;

        document.onmouseup = closeDragElement;
        document.onmousemove = dragElement;
    };

    // Mouse move event to drag the element
    function dragElement(e) {
        e.preventDefault();

        // Calculate the new position based on mouse movement
        let newX = offsetX + (e.clientX - initialMouseX);
        let newY = offsetY + (e.clientY - initialMouseY);

        // Update the position of the element
        element.style.left = newX + "px";
        element.style.top = newY + "px";
    }

    // Mouse up event to stop dragging
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Apply draggable to the notepad
makeDraggable(notepad);

function showNotepad() {
    const notepad = document.getElementById('notepad');
    
    // Set the initial opacity to 0 (if not already set by CSS)
    notepad.style.opacity = '0';
    
    // Make the notepad visible (in case it was hidden)
    notepad.style.display = 'block';  // Ensure it's visible for the fade-in
    
    // Trigger the fade-in effect with a slight delay
    setTimeout(() => {
        notepad.style.opacity = '1';  // Fade-in effect
    }, 500);  // Delay for the fade-in to start
}

// Call the function to show the notepad when needed (for example, after audio starts)

// 定视频信息
const videos = [
    { id: 'vid1', src: 'public/vid12.mp4', startTime: 14.00},
    { id: 'vid2', src: 'public/vid2.mp4', startTime: 31.17},
    { id: 'vid3', src: 'public/vid3.mp4', startTime: 46.03},
    { id: 'vid4', src: 'public/vid6.mp4', startTime: 61.00},
    { id: 'vid5', src: 'public/vid5.mp4', startTime: 75.60},
    { id: 'vid6', src: 'public/vid4.mp4', startTime: 90.22},
    { id: 'vid7', src: 'public/vid11.mp4', startTime: 106.25},
    { id: 'vid8', src: 'public/vid7.mp4', startTime: 138.25},
    { id: 'vid9', src: 'public/vid13.mp4', startTime: 153.23},
    { id: 'vid10', src: 'public/vid12.mp4', startTime: 182.17}
];

// 创建视频元素并插入到页面中
let currentVideoElement = null; // 保存当前视频元素

function createVideoElement(videoData) {
    const videoContainer = document.getElementById('video-container');

    // 创建新的视频元素
    const videoElement = document.createElement('video');
    videoElement.src = videoData.src;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.classList.add('video-element'); // 使用CSS样式

    // 获取窗口的宽度和高度
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 确保视频的宽高不会超出屏幕边缘
    const videoWidth = windowWidth * 0.7; // 70% 的屏幕宽度
    const videoHeight = videoWidth * 9 / 16; // 根据16:9的比例计算高度

    // 计算视频可以随机出现的最大位置
    const maxX = windowWidth - videoWidth;
    const maxY = windowHeight - videoHeight;

    // 随机生成视频的 left 和 top 值
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    // 应用随机位置
    videoElement.style.width = `${videoWidth}px`; // 设置视频的宽度
    videoElement.style.height = `${videoHeight}px`; // 设置视频的高度
    videoElement.style.left = `${randomX}px`;
    videoElement.style.top = `${randomY}px`;

    // 将视频添加到容器中
    videoContainer.appendChild(videoElement);

    // 设置渐变进入效果
    setTimeout(() => {
        videoElement.style.opacity = 1; // 视频淡入
    }, 100); // 100ms延迟确保显示的平滑过渡

    // 移除之前的视频
    const previousVideoElement = currentVideoElement; // 先保存前一个视频元素
    if (previousVideoElement) {
        setTimeout(() => {
            previousVideoElement.style.opacity = 0; // 淡出前一个视频
            setTimeout(() => {
                previousVideoElement.remove(); // 从DOM中移除前一个视频
            }, 2000); // 保持与CSS中过渡效果一致
        }, 10000); // 5秒后移除前一个视频
    }

    // 更新当前视频为新创建的视频
    currentVideoElement = videoElement;
}

function initVideos() {
    let currentVideoIndex = 0;

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;

        // 检查当前音乐时间是否到达下一个视频的播放时间
        if (currentVideoIndex < videos.length && currentTime >= videos[currentVideoIndex].startTime) {
            createVideoElement(videos[currentVideoIndex]);
            currentVideoIndex++; // 播放完一个视频后，移动到下一个视频
        }
    });
}

// 页面加载时初始化
window.onload = function() {
    moonAnimationStartTime = new Date().getTime();
    showLoadingAnimation();
    initTypewriterEffect(); // 初始化文字效果

    // 音频播放事件
    audio.addEventListener('play', () => {
        document.getElementById('sky').style.display = 'block'; // 显示天空容器
        createMoon();
        generateStars(100); // 生成100颗星星
        requestAnimationFrame(checkMusicTime); // 启动音乐时间检查
        showNotepad(); // 显示记事本

        // 初始化视频：当音乐开始播放时才开始触发视频显示
        initVideos();
    });
};
