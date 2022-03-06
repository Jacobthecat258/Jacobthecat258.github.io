var j = {
    install: (ispkgs) => {
        j.internal.install(ispkgs);
    },
    inst: (ispkgs) => {
        j.internal.install(ispkgs);
    },
    packages: {
        $: {
            name: "$",
            j: {
                $: (e) => {
                    return j.internal.functions.$(e);
                },
                qs: (e) => {
                    return j.internal.functions.$(e);
                },
                $$: (e) => {
                    return j.internal.functions.$$(e);
                },
                qsa: (e) => {
                    return j.internal.functions.$$(e);
                }
            },
            functions: {
                $: (e) => {
                    try {
                        return document.querySelector(e);
                    } catch(err) {
                        throw `J error: Pkg/$/$: ${err}`;
                    }
                },
                $$: (e) => {
                    try {
                        return document.querySelectorAll(e);
                    } catch(err) {
                        throw `J error: Pkg/$/$$: ${err}`;
                    }
                }
            },
        },
        keypress: {
            name: "keypress",
            j: {
                detectKeyPress: (key, run) => {
                    return j.internal.functions.dkp(key, run);
                },
                dkp: (key, run) => {
                    return j.internal.functions.dkp(key, run);
                },
            },
            functions: {
                dkp: (key, run) => {
                    try {
                        if (typeof key == "string") {
                            if (typeof run == "function") {
                                window.addEventListener("keydown", (e) => { //e & ev = Event
                                    if (e.code == key) {
                                        run();
                                    }
                                });
                            } else {
                                throw `Attribute 2: Expected function, got ${typeof run}`;
                            }
                        } else {
                            throw `Attribute 1: Expected string, got ${typeof key}`;
                        }
                    } catch(err) {
                        throw `J error: ${err}`;
                    }
                },
            }
        },
        gamepad: {
            name: "gamepad",
            install: {
                name: "gamepad",
                object: {
                    tick: () => {
                        try {
                            var gps = navigator.getGamepads(); //gps = Gamepads
                            var gpsOutArr = []; //gpsOutArr = Gamepads Out Array
                            for (i = 0; i < gps.length; i++) {
                                var gpsOut = {
                                    axes: [],
                                    buttons: [],
                                    connected: true,
                                    id: "",
                                    index: null,
                                    mapping: "",
                                    timestamp: null
                                };
                                if (gps[i] && gps[i]?.connected) {
                                    var axes = gps[i].axes;
                                    var buttons = gps[i].buttons;
                                    var id = gps[i].id;
                                    var index = gps[i].index;
                                    var mapping = gps[i].mapping;
                                    var timestamp = gps[i].timestamp
                                    for (a = 0; a < axes.length; a++) {
                                        gpsOut.axes.push(axes[a]);
                                    }
                                    for (b = 0; b < buttons.length; b++) {
                                        var btn = {}
                                        btn.pressed = buttons[b].pressed;
                                        btn.touched = buttons[b].touched;
                                        btn.value = buttons[b].value;
                                        gpsOut.buttons.push(btn);
                                    }
                                    gpsOut.id = id;
                                    gpsOut.index = index;
                                    gpsOut.mapping = mapping;
                                    gpsOut.timestamp = timestamp;
                                } else {
                                    gpsOut = null;
                                }
                                gpsOutArr.push(gpsOut);
                            }
                            j.internal.install.gamepad.gamepads = gpsOutArr;
                            j.gamepads = gpsOutArr;
                        } catch(err) {
                            throw `Gamepad error: ${err}`;
                        }
                    },
                    gamepads: []
                }
            },
            j: {
                gamepadTick: () => {
                    j.internal.install.gamepad.tick();
                },
                gpt: () => {
                    j.internal.install.gamepad.tick();
                },
                gamepads: []
            }
        },
        input: {
            name: "input",
            prerun: () => {
                window.addEventListener("keydown",(e) => {
                    if (j.internal.install.input.keysdown.indexOf(e.code) == -1) {
                        j.internal.install.input.keysdown.push(e.code);
                        j.internal.install.input.keysdownintervalids.push(setInterval((e) => {
                            if (j.internal.install.input.keysdown.indexOf(e.code) == -1) {
                                clearInterval(j.internal.install.input.keysdownintervalids.indexOf(e.code));
                            } else {
                                window.dispatchEvent(new CustomEvent("jinput", {
                                    detail: {
                                        key: `KB/${e.code}`
                                    }
                                }));
                            }
                        },10,e));
                    }
                });
                window.addEventListener("keyup",(e) => {
                    if (j.internal.install.input.keysdown.indexOf(e.code) != -1) {
                        j.internal.install.input.keysdown.splice(j.internal.install.input.keysdown.indexOf(e.code),1);
                    }
                });
                window.addEventListener("mousedown",(e) => {
                    window.dispatchEvent(new CustomEvent("jinput", {
                        detail: {
                            key: `Mouse/${["Left","Middle","Right","X1","X2"][e.button]}`,
                            count: e.detail
                        }
                    }));
                });
                if (j.internal.installs.indexOf(j.internal.packages.gamepad) != -1) {
                    setInterval(() => {
                        j.gamepadTick();
                        var gp = j.gamepads;
                        for (g = 0; g < gp.length; g++) {
                            for (b = 0; b < gp[g]?.buttons.length; b++) {
                                if (gp[g].buttons[b].pressed) {
                                    window.dispatchEvent(new CustomEvent("jinput", {
                                        detail: {
                                            key: `Gamepad/${g}/Button${b}`,
                                            value: gp[g].buttons[b].value
                                        }
                                    }));
                                }
                            }
                            for (a = 0; a < gp[g]?.axes.length; a++) {
                                if (!(gp[g].axes[a] >= j.internal.install.input.minimumJoystickDisableDetection && gp[g].axes[a] <= j.internal.install.input.maximumJoystickDisableDetection)) {
                                    window.dispatchEvent(new CustomEvent("jinput", {
                                        detail: {
                                            key: `Gamepad/${g}/Axes${a}${(() => {
                                                if (gp[g].axes[a] < 0) {
                                                        return "+";
                                                    } else {
                                                         return "-";
                                                    }
                                                })()}`,
                                            value: gp[g].axes[a]
                                            //Starting here is a change of the code
                                            ,gamepad: g,
                                            axes: `${a}${(() => {
                                                if (gp[g].axes[a] < 0) {
                                                        return "+";
                                                    } else {
                                                         return "-";
                                                    }
                                                })()}`,
                                            axesnum: a,
                                            axesvalue: gp[g].axes[a],
                                            axesdirection: (() => {
                                                if (gp[g].axes[a] < 0) {
                                                        return "+";
                                                    } else {
                                                         return "-";
                                                    }
                                                })()
                                            //Ending here is a change of the code
                                       }
                                    }));
                                }
                            }
                        }
                    }, 10);
                } else {
                    console.log("Jinput: Gamepad package reqired to detect gamepad inputs. If needed, please add J.packages");
                }
                
            },
            install: {
                name: "input",
                object: {
                    minimumJoystickDisableDetection: -0.2,
                    maximumJoystickDisableDetection: 0.2,
                    keysdown: [],
                    keysdownintervalids: []
                }
            }
        }
    },
    internal: {
        wti: { //Writing to Instsall
            internal: {
                functions: {},
                install: {},
                installs: []
            }
        },
        installs: [],
        installPkg: (pkg,ispkgs,isInitial) => { //SubPackage InDev
            if (!isInitial) {
                throw `J error: installPkg when not initial is not finished`;
            }
            var sub = "";
            if (!isInitial) {
                sub = "sub-"
            }
            console.log(`J: Installing ${sub}package ${pkg+1}/${ispkgs.length}${(() => {
                var pkgname = ispkgs[pkg].name;
                if (typeof pkgname == "string") {
                    return `: ${pkgname}`
                } else {
                    return "";
                }
            })()}`);
            if (typeof ispkgs[pkg] == "object") {
                if (ispkgs[pkg]?.internal != null) {
                    if (typeof ispkgs[pkg].internal == "object") {
                        for (j.ik = 0; j.ik < Object.keys(ispkgs[pkg].internal).length; j.ik++) { //j.ik = Internal Keys
                            console.log(`J: Installing ${sub}package ${pkg+1}: Internal ${j.ik}`);
                            j.internal.wti.internal[Object.keys(ispkgs[pkg].internal)[j.ik]] = ispkgs[pkg].internal[Object.keys(ispkgs[pkg].internal)[j.ik]];
                        }
                    } else {
                        threw = true;
                        throw `Could not install: ${sub}Package ${pkg}: Internal writing: Expected object, got ${typeof ispkgs[pkg].internal}`; 
                    }
                }
                if (ispkgs[pkg]?.j != null) {
                    if (typeof ispkgs[pkg].j == "object") {
                        for (j.jk = 0; j.jk < Object.keys(ispkgs[pkg].j).length; j.jk++) { //j.jk = J Keys
                            console.log(`J: Installing ${sub}package ${pkg+1}: J ${j.jk}`);
                            j.internal.wti[Object.keys(ispkgs[pkg].j)[j.jk]] = ispkgs[pkg].j[Object.keys(ispkgs[pkg].j)[j.jk]];
                        }
                    } else {
                        threw = true;
                        throw `Could not install: ${sub}Package ${pkg}: J writing: Expected object, got ${typeof ispkgs[pkg].j}`; 
                    }
                }
                if (ispkgs[pkg]?.functions != null) {
                    if (typeof ispkgs[pkg].functions == "object") {
                        for (j.fk = 0; j.fk < Object.keys(ispkgs[pkg].functions).length; j.fk++) { //j.fk = Function Keys
                            console.log(`J: Installing ${sub}package ${pkg+1}: Function ${j.fk}`);
                            j.internal.wti[Object.keys(ispkgs[pkg].functions)[j.fk]] = ispkgs[pkg].functions[Object.keys(ispkgs[pkg].functions)[j.fk]];
                        }
                    } else {
                        threw = true;
                        throw `Could not install: ${sub}Package ${pkg}: Functions writing: Expected object, got ${typeof ispkgs[pkg].functions}`; 
                    }
                }
                if (ispkgs[pkg]?.prerun != null) {
                    if (typeof ispkgs[pkg].prerun == "function") {
                        console.log(`J: Running pre-run function`);
                        fn = (ispkgs[pkg].prerun);
                        window.setTimeout((fn) => {
                            fn();
                        },0,fn);
                    } else {
                        threw = true;
                        throw `Could not install: ${sub}Package ${pkg}: Pre-execution: Expected function, got ${typeof ispkgs[pkg].internal}`; 
                    }
                }
                if (ispkgs[pkg]?.install != null) {
                    if (typeof ispkgs[pkg].install == "object") {
                        if (typeof ispkgs[pkg].install?.name == "string") {
                            if (typeof ispkgs[pkg].install?.object == "object") {
                                console.log(`J: Installing ${sub}package ${pkg+1}: Install object`);
                                j.internal.wti.internal.install[ispkgs[pkg].install.name] = ispkgs[pkg].install.object;
                            } else {
                                throw `Could not install: ${sub}Package ${pkg}: Install: Expected object, got ${typeof ispkgs[pkg].install?.object}`;
                            }
                        } else {
                            throw `Could not install: ${sub}Package ${pkg}: Install: Expected string, got ${typeof ispkgs[pkg].install?.name}`;
                        }
                    } else {
                        throw `Could not install: ${sub}Package ${pkg}:Expected object, got ${typeof ispkgs[pkg].install}`;
                    }
                }
            } else {
                threw = true;
                throw `Could not install: ${sub}Package ${pkg}: Expected string, got ${typeof ispkgs[pkg]}`;
            }
        },
        install: (ispkgs) => { //ispkgs = Install Packages
            try {  //Try loop may be disabled for debugging, not showing where error was
                var threw = false;
                j.internal.wti.help = j.help;
                j.internal.packages = j.packages;
                j.internal.wti.internal.packages = j.packages;
                //j.internal.wti.installPkg = j.internal.installPkg; Disabled as this feature is unfinished
                if (typeof ispkgs == "object") {
                    for (pkg = 0; pkg < ispkgs?.length; pkg++) {
                        j.internal.installPkg(pkg,ispkgs,true);
                        j.internal.installs.push(ispkgs[pkg]);
                        j.internal.wti.internal.installs.push(ispkgs[pkg]);
                    }
                } else {
                    threw = true;
                    throw `Could not install: Expected object, got ${typeof ispkgs}.`;
                }
                if (!threw) {
                    console.log(`J: Finished installing`);
                    j.internal.wti.internal.befinst = j; //befinst = Before Install
                    j = j.internal.wti;
                }
                //*
            } catch(err) {
                throw `J error: ${err}`;
            }
            //*/
        }
    },
    help: `
    How to use: Run J.inst() or J.install() with an array as attribute 1:
    Use objects in the array as packages.

    How to make a package: Use an object.
    Set these attributes:
    name: The name of the package, used in the log.
    j: An object that will be applied to the J object
    internal: An object that will be applied to J.internal
    functions: An object that will be applied to J.functions
    prerun: A function that will be run after installing the package | NOTE: When writing to J, don't use J. Instead, use J.internal.wti
    install: An object for storing the general install of the object. Goes into J.internal.install. Keys:
        name: The name of the object. For example, "test" would move the object into J.internal.install.test
        object: the object that will be moved

    How to use built-in packages:
    $:
        J.$(e): Same as document.querySelector
        J.qs(e): Same as document.querySelector
        J.$$(e): Same as document.querySelectorAll
        J.qsa(e): Same as document.querySelectorAll
    keypress:
        J.detectKeyPress(key,run): When KEY pressed, execute RUN
        J.dkp(key,run): When KEY pressed, execute RUN
    gamepad:
        J.gamepadTick(): Updates gamepads
        J.gpt: Updates gamepads
        J.gamepads: An array with gamepads
        J.internal.install.gamepad.gamepads: An array with gamepads
    input:
        Jinput: Event
            detail.key: A string based on what input is used
            detail.value: Info such as a joysticks position
            detail.count: Streak of inputs, only used with mouse input
            Note: When joystick is used, is only fired when value is not in the range j.internal.install.input.minimumJoystickDisableDetection and j.internal.install.input.maximumJoystickDisableDetection
        Note: Gamepad inputs can only be detected when J.packages.gamepad is install
    `
}