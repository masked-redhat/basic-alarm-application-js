const setPrevious = (x) => {
    ForBtn.className = x ? 'selected' : '';
    ToBtn.className = !x ? 'selected' : '';
    ForBtn.disabled = false;
    ToBtn.disabled = false;
    if (x) {
        ForBtn.click()
    } else { ToBtn.click(); }
    alarm.style.pointerEvents = 'all';
}

const playAudio = () => {
    let AUDIO = new Audio(sound);
    AUDIO.play()
    AUDIO.loop = true;
    setTimeout(() => {
        AUDIO.loop = false;
    }, 4000);
}

const updateTime = () => {
    let time = getTime();
    for (let i = 0; i < 6; i++) {
        if (Number(time[i]) / 10 < 1) {
            time[i] = '0' + time[i];
        }
        inputs[i].value = time[i];
    }
}

const getTime = () => {
    let d = new Date();
    let time = [d.getHours(), d.getMinutes(), d.getSeconds()];
    let date = [d.getDate(), d.getMonth() + 1, d.getFullYear()];
    let timeDate = [...time, ...date];
    return timeDate;
}

let UPDATE;

const sound = './sound.wav';

const inputs = Array.from(document.getElementsByTagName('input'));

const alarm = document.getElementById('alarm');

const ForBtn = document.getElementById('for');
const ToBtn = document.getElementById('to');

const setBtn = document.getElementById('set');

updateTime();
inputs.forEach(e => {
    e.addEventListener('input', (e) => {
        let val = e.target.value;
        let [min, max] = [e.target.min, e.target.max];
        if (Number(val) > max || Number(val) < min) {
            e.target.value = max;
        }
    })
})

ForBtn.onclick = () => {
    ForBtn.classList.add('selected')
    ToBtn.classList.remove('selected')
    try {
        clearInterval(UPDATE);
    } catch { }
    document.getElementById('hour').value = '0';
    document.getElementById('minute').value = '20';
    document.getElementById('second').value = '0';

    document.getElementById('day').disabled = true;
    document.getElementById('month').disabled = true;
    document.getElementById('year').disabled = true;
}

ToBtn.onclick = () => {
    ForBtn.classList.remove('selected')
    ToBtn.classList.add('selected')
    updateTime();
    UPDATE = setInterval(() => {
        updateTime();
    }, 1000);

    inputs.forEach((e) => {
        e.onfocus = () => {
            clearInterval(UPDATE);
        }
    })

    document.getElementById('day').disabled = false;
    document.getElementById('month').disabled = false;
    document.getElementById('year').disabled = false;
}

setBtn.onclick = () => {
    try {
        clearInterval(UPDATE);
    } catch { }
    let x = (ForBtn.className == 'selected');
    ForBtn.disabled = true;
    ToBtn.disabled = true;
    alarm.style.pointerEvents = 'none';
    let forTime;
    if (x) {
        let [hour, minute, second] = [document.getElementById('hour').value, document.getElementById('minute').value, document.getElementById('second').value];
        forTime = Number(hour) * 3600 + Number(minute) * 60 + Number(second);
        forTime *= 1000;
    }
    else {
        let d = new Date();
        let c = d.getTime();
        d.setHours(document.getElementById('hour').value);
        d.setMinutes(document.getElementById('minute').value);
        d.setSeconds(document.getElementById('second').value);
        d.setDate(document.getElementById('day').value);
        d.setMonth(document.getElementById('month').value - 1);
        d.setFullYear(document.getElementById('year').value);
        let n = d.getTime();
        forTime = n - c;
    }
    if (forTime < 0) {
        playAudio();
        setPrevious(x);
    }
    else {
        setTimeout(() => {
            playAudio()
            setPrevious(x);
        }, forTime);
    }
}

ForBtn.click();