//Prevent context menu
window.oncontextmenu = () => false;

//Define functions
function $(e) {
    return document.querySelector(e);
}

//Define nodes and vairables
var home = $("#home")
var login_username = $("#username");
var login_password = $("#password");
var login_name = $("#name");
var login_button = $("#login");
var loading = $("#loading");
var test = $("#test");
var question = $("#question");
var answer = $("#answer");
var submit = $("#submit");
var reportNode = $("#report");
var reportMeter = $("#score-display");
var reportText = $('#score-text');
var download = $("#download");
var hint = $("#hint");
var hintText = "";
var questionnumber = -1;
var report = [];
var submittedName = "";
var spinningWheelShown = false;

//Define Load question
function loadquestion(number) {
    question.innerHTML = questions[number].question;
    answer.value = "";
    window.hintText = questions[number].hint;
    window.questionnumber = number;
    report.push({hint: false});
}

//Detect button presses
login_button.addEventListener("click", function() {
    if (login_username.value.toLowerCase() == "m2023g5" && login_password.value.toLowerCase() == "bernstein" && login_name.value) {
        home.style.display = "none";
        loading.style.display = "block";
        submittedName = $("#name").value;
        $("#welcomeName").innerText = submittedName;
        setTimeout(function() {
            loading.style.display = "none";
            test.style.display = "block";
            loadquestion(0);
        }, Math.random() * 4000 + 4000);
    } else if (login_username.value && login_password.value && login_name.value) {
        alert("Invalid login. Please confirm that the username and password are correct.");
    } else if (!login_username.value) {
        alert("Please enter a session ID.");
    } else if (!login_password) {
        alert("Please enter a password.");
    } else {
        alert("Please enter a name.");
    }
});

hint.addEventListener("click", function() {
    report[questionnumber].hint = true;
    alert(hintText);
});

submit.addEventListener("click", function() {
    if (answer.value) {
        report[questionnumber].answer = answer.value;
        if (questions[questionnumber].answers.indexOf(answer.value.toLowerCase()) == -1) {
            report[questionnumber].correct = false;
        } else {
            report[questionnumber].correct = true;
        }
        if (questionnumber == questions.length - 1 && !spinningWheelShown) {
            spinningWheelShown = true;
            //alert("ur done");
            //test.style.display = "none";
            let loadingDisplay = document.createElement("div");
            loadingDisplay.classList.add("spinningWheel");
            test.append(loadingDisplay);
            setTimeout(function() {
                var score = 0;
                for (i = 0; i < report.length; i++) {
                    if (report[i].correct) score++;
                }
                reportMeter.max = report.length;
                reportMeter.value = score;
                reportText.innerHTML = (score / report.length) * 100 + "%";
                download.href = URL.createObjectURL(new Blob([JSON.stringify(report)]));
                download.download = "report " + new Date() + ".json";
                test.style.display = "none";
                reportNode.style.display = "block";
            }, Math.random() * 6000 + 2000);
        } else if (!spinningWheelShown) {
            spinningWheelShown = true;
            let loadingDisplay = document.createElement("div");
            loadingDisplay.classList.add("spinningWheel");
            test.append(loadingDisplay);
            setTimeout(function() {
                spinningWheelShown = false;
                loadingDisplay.remove();
                loadquestion(questionnumber + 1);
            }, Math.random() * 1500 + 500);
        }
    }
});