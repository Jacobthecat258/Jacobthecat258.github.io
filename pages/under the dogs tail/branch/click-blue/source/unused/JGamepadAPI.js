var jcont = {
    tick: () => {
        var conts = navigator.getGamepads();
        jcont.length = conts.length;
        for (i = 0; i < conts.length; i++) {
            if (conts[i] && conts[i]?.connected) {
                var tempcont = {
                    axes: [],
                    buttons: [],
                    connected: true,
                    id: "",
                    index: null,
                    mapping: "",
                    timestamp: null,
                }
                var axes = conts[i].axes;
                var buttons = conts[i].buttons;
                var id = conts[i].id;
                var index = conts[i].index;
                var mapping = conts[i].mapping;
                var timestamp = conts[i].timestamp
                for (a = 0; a < axes.length; a++) {
                    tempcont.axes.push(axes[a]);
                }
                for (b = 0; b < buttons.length; b++) {
                    var btn = {}
                    btn.pressed = buttons[b].pressed;
                    btn.touched = buttons[b].touched;
                    btn.value = buttons[b].value;
                    tempcont.buttons.push(btn);
                }
                tempcont.id = id;
                tempcont.index = index;
                tempcont.mapping = mapping;
                tempcont.timestamp = timestamp;
                jcont[`cont${i}`] = tempcont;
            } else {
                jcont[`cont${i}`] = null;
            }
        }
    }
}