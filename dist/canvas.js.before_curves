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
           

            draw();
            inputCount++;
        }
        else
        {
            clear();
            inputCount = 0;
        }
    });


function draw()
{

    ctx.fillStyle = "rgb(200,0,0, 5%)";
    ctx.beginPath();

    if (inputCount === 0)
    {
        ctx.translate(100,120);
    }
    if (inputCount === 3)
    {
        ctx.translate(100,0);
    }

    for (let i = coords.length; i >= 0; i--)
    {
        if (i === 0)
        {
            break;
        }
        //ctx.lineTo(coords[i], coords[i-1]);
        // arc(x, y, radius, startAngle, endAngle, counterclockwise)
        ctx.arc(0, 0, coords[i]/2, coords[i-1], coords[i-2] * Math.PI);
    }

    ctx.closePath();

    ctx.fill();

}

function clear()
{
    ctx.setTransform(1,0,0,1,0,0);
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
//    ctx.translate(150,150);
}


// Source - https://stackoverflow.com/a/28615888
// Posted by Mr. Polywhirl, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-10, License - CC BY-SA 3.0
function chunk(str, size) {
    return str.match(new RegExp('.{1,' + size + '}', 'g'));
}
