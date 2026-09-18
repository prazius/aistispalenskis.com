const canvas = document.getElementById("canvas_square");
const ctx = canvas.getContext("2d");

let coords = [];

let inputCount = 0;


// ctx.translate(150,150);

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
            console.log(coords);
           
ctx.beginPath()
            draw();
            inputCount = (inputCount + 1) % 5;
        }
        else
        {
            clear();
            inputCount = 0;
        }
    });



let mouthX = -100;
let mouthY = 140;

let skipDrawingNose = false;
let skipDrawingEyebrows = false;

function draw()
{


    ctx.fillStyle = `rgb(${coords[0]} ${coords[1]} ${coords[2]} / ${coords[3]}%)`;

    if (inputCount === 0)
    {
        ctx.translate(80,100);

        for (let i = coords.length; i >= 0; i--)
        {
            if (i === 0)
            {
                break;
            }

            ctx.arc(0, 0, coords[0]/1.5, coords[1], coords[2] * Math.PI);
        }
        //ctx.stroke();
    }

    if (inputCount === 1)
    {
        ctx.translate(120,0);

        for (let i = coords.length; i >= 0; i--)
        {
            if (i === 0)
            {
                break;
            }
            ctx.arc(0, 0, coords[i]/2, coords[i-1], coords[i-2] * Math.PI);
        }
        //ctx.stroke();
    }

    if (inputCount === 2)
    {
        // draw a mouth
        //
        ctx.beginPath();

        ctx.moveTo(mouthX, mouthY);
        // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        ctx.bezierCurveTo(-coords[2]/1.5,coords[0]*3,-coords[3]/1.5,coords[1]*3,30,150);



        //ctx.stroke();
        ctx.resetTransform();

    }
    let nosePath = null;

    if (inputCount === 3 && skipDrawingNose === false)
    {
        // draw a nose
        nosePath = new Path2D(); //new path for mask
        ctx.moveTo(150,110);
        ctx.bezierCurveTo(coords[2],150,coords[1],150,coords[0]*2,200);
        ctx.bezierCurveTo(200,200,200,200,150,coords[3]*2);
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgb(200,0,0,100%)";
        //ctx.stroke();
        ctx.lineWidth = 1;
        skipDrawingNose = true;
    }

    if (inputCount === 4 && skipDrawingEyebrows === false)
    {
        //draw eyebrows
        const eyebrow = new Path2D();

        eyebrow.moveTo(30, 60);
        eyebrow.bezierCurveTo(
            coords[0],
            coords[1],
            coords[2],
            coords[3],
            130,
            coords[1]
        );

        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke(eyebrow);

        skipDrawingEyebrows = true;
    }

    ctx.closePath();

    ctx.fill();



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
}


// Source - https://stackoverflow.com/a/28615888
// Posted by Mr. Polywhirl, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-10, License - CC BY-SA 3.0
function chunk(str, size) {
    return str.match(new RegExp('.{1,' + size + '}', 'g'));
}
