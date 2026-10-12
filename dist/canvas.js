const canvas = document.getElementById("canvas_square");
const ctx = canvas.getContext("2d");

let coords = [];

let inputCount = 0;

let num0;
let num1;
let num2;
let num3;
// ctx.translate(150,150);
let colorCoords = ``;

const liveInput = document.getElementById("liveInput");
liveInput.addEventListener("input", (e) =>
    {
        const inputStr = e.target.value;
        if (inputStr !== "")
        {
            const lastChar = inputStr[inputStr.length - 1];
            const charNum = lastChar.charCodeAt(0) * 17654321;
            const stringNum = charNum.toString();
            coords = chunk(stringNum, 2);
            coords.shift(); // second set of numbers varies more, so i chuck the first one out
            // console.log(coords);

            num0 = Number(coords[0]);
            num1 = Number(coords[1]);
            num2 = Number(coords[2]);
            num3 = Number(coords[3]);

            // console.log(coords, num0, num1, num2);

            colorCoords = `rgba(${num0}, ${num1}, ${num2}, 0.35)`;
            ctx.beginPath()


            draw();
            inputCount = (inputCount + 1) % 6;
        }
        else
        {
            clear();
            inputCount = 0;
        }
    });


// const colorCoords = `rgb(${coords[0]} ${coords[1]} ${coords[2]} / 15%)`;




let mouthX = -100;
let mouthY = 140;

let nosePath = null;
let eyebrow = null;

let skipDrawingNose = false;
let skipDrawingEyebrows = false;
let skipDrawingMouth = 0;
let skipDrawingTeeth = false;

function applyNoseClip()
{
    if (!nosePath) return;
    const mask = new Path2D();
    mask.rect(0,0,canvas.width,canvas.height);
    mask.addPath(nosePath);
    ctx.clip(mask, "evenodd");
}

function applyLeftEyebrowMask()
{
    if (!eyebrowLeft) return;
    const mask = new Path2D(eyebrowLeft);

    // Continue from the end of the eyebrow
    mask.lineTo(canvas.width, canvas.height);
    mask.lineTo(0, canvas.height);

    mask.closePath();

    ctx.clip(mask);
    // ctx.stroke(mask); // debug stroke
}


function applyRightEyebrowMask()
{
    if (!eyebrowLeft) return;
    const mask = new Path2D(eyebrowRight);

    // Continue from the end of the eyebrow
    mask.lineTo(canvas.width, canvas.height);
    mask.lineTo(0, canvas.height);

    mask.closePath();

    ctx.clip(mask);
    // ctx.stroke(mask); // debug stroke
}

function draw()
{
    if (inputCount === 0 && skipDrawingNose === false)
    {
        // nose
        //
        nosePath = new Path2D(); //new path for mask
        nosePath.moveTo(150,110);
        nosePath.bezierCurveTo(coords[2],150,coords[1],150,coords[0]*2,200);
        nosePath.bezierCurveTo(200,200,200,200,150,Math.max(num3*2,180));
        nosePath.closePath();
        ctx.save();
        ctx.resetTransform();
        ctx.lineWidth = 4;
        // ctx.fillStyle = "rgb(200,0,0,100%)";
        ctx.stroke(nosePath);
        // ctx.fill(nosePath);
        ctx.restore();
        skipDrawingNose = true;
    }

let leftEyebrowEndsCoords = [];

    if (inputCount === 1 && skipDrawingEyebrows === false)
    {
        // left eyebrow
        //
        eyebrowLeft = new Path2D();

        ctx.save();
        ctx.resetTransform();
        applyNoseClip();

        eyebrowLeft.moveTo(30, 60);
        eyebrowLeft.bezierCurveTo(
            coords[0],
            coords[1],
            coords[2],
            coords[3],
            130,
            coords[1]
        );

        leftEyebrowEndsCoords = [130, coords[1]];

        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke(eyebrowLeft);
        ctx.restore();
        // skipDrawingEyebrows = true;
    }

    if (inputCount === 1 && skipDrawingEyebrows === false)
    {
        // left eyebrow
        //
        eyebrowRight = new Path2D();

        ctx.save();
        ctx.resetTransform();
        applyNoseClip();
        eyebrowRight.moveTo(leftEyebrowEndsCoords[0]+30, leftEyebrowEndsCoords[1]);
        eyebrowRight.bezierCurveTo(
            num2+130,
            num0,
            num3+180,
            num1-50,
            260,
            50
        );

        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke(eyebrowRight);
        ctx.restore();
        skipDrawingEyebrows = true;
    }

    if (inputCount === 2)
    {
        // left eye
        //
        ctx.save();
        ctx.resetTransform();
        applyNoseClip();
        applyLeftEyebrowMask();
        ctx.translate(80,100);
        ctx.beginPath();
        for (let i = coords.length - 1; i >= 0; i--)
        {
            ctx.arc(0, 0, coords[0]/1.5, coords[1], coords[2] * Math.PI);
        }
        ctx.fillStyle = colorCoords;
        ctx.fill();
        ctx.restore();
    }

    if (inputCount === 3)
    {
        // right eye
        //
        ctx.save();
        ctx.resetTransform();
        applyNoseClip();
        applyRightEyebrowMask();
        ctx.translate(200,100);
        ctx.beginPath();

        for (let i = coords.length; i >= 0; i--)
        {
            if (i === 0)
            {
                break;
            }
            ctx.arc(0, 0, coords[i]/2, coords[i-1], coords[i-2] * Math.PI);
        }
        //ctx.stroke();
        ctx.fillStyle = colorCoords;
        ctx.fill();
        ctx.restore();
    }

    if (inputCount === 4 && skipDrawingMouth < 2)
    {
        // mouth
        //
        ctx.save();
        ctx.resetTransform();
        applyNoseClip();
        ctx.translate(200,100);
        ctx.beginPath();

        ctx.moveTo(mouthX, mouthY);
        // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        ctx.bezierCurveTo(
            -coords[2]/1.5,
            coords[0]*3,
            -coords[3]/1.5,
            coords[1]*3,
            30,
            150
        );
        //ctx.stroke();
        ctx.fillStyle = colorCoords;
        ctx.fill();
        ctx.restore();
        skipDrawingMouth += 1;
    }

    if (inputCount === 4 && skipDrawingTeeth === false && skipDrawingMouth > 1)
    {
        // draw teeth
        ctx.save();
        ctx.resetTransform();

        ctx.translate(200,100);
        // ctx.rect(0,0,5,5); // debug square
        
        ctx.beginPath();
        ctx.moveTo(mouthX, mouthY);

        let downX = -80;
        let downY = 170;
        let upX = -65;
        let upY = 150;

        let dx = mouthX - 30;
        let dy = mouthY - 150;
        let mouthLength = Math.hypot(dx, dy);
        let inputForTeethCount = 4 + (num0 % 4);
        console.log(inputForTeethCount);
        let teethWidth = mouthLength / inputForTeethCount;
        let teethCount = mouthLength / teethWidth;

        downX = mouthX + teethWidth;
        upX = mouthX + teethWidth;


        for (let i = 0; i < teethCount; i++)
        {
            if (i === 0)
            {
                // continue;
            }
            for (let j = 0; j < teethCount; j++)
            {
                ctx.lineTo(downX, downY);
                ctx.lineTo(upX, upY);
            }
            downX += teethWidth;
            upX += teethWidth;
        }
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "gray";
        ctx.stroke();
        ctx.fill();

        // lip line to make teeth look better
        ctx.beginPath();
        ctx.moveTo(mouthX,mouthY);
        ctx.lineTo(30,150);
        ctx.closePath();
        ctx.strokeStyle = colorCoords;
        ctx.lineWidth = 5;
        ctx.stroke();

//        ctx.fill();
        

        ctx.restore();

        skipDrawingTeeth = true;
    }

    ctx.closePath();

    ctx.restore();
   // ctx.fill();



}

function clear()
{
    ctx.setTransform(1,0,0,1,0,0);
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mouthX = -100;
    mouthY = 140;

    skipDrawingNose = false;
    skipDrawingEyebrows = false;
    skipDrawingMouth = 0;
    skipDrawingTeeth = false;
}


// Source - https://stackoverflow.com/a/28615888
// Posted by Mr. Polywhirl, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-10, License - CC BY-SA 3.0
function chunk(str, size) {
    return str.match(new RegExp('.{1,' + size + '}', 'g'));
}
