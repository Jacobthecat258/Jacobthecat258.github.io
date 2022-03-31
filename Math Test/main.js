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
var login_button = $("#login");
var test = $("#test");
var queston = $("#queston");
var answer = $("#answer");
var submit = $("#submit");
var reportNode = $("#report");
var reportMeter = $("#score-display");
var reportText = $('#score-text');
var download = $("#download");
var hint = $("#hint");
var hintText = "";
var questonnumber = -1;
var report = [];

//Define Load Queston
function loadQueston(number) {
    queston.innerHTML = questons[number].queston;
    answer.value = "";
    window.hintText = questons[number].hint;
    window.questonnumber = number;
    report.push({hint: false});
}

//Detect button presses
login_button.addEventListener("click", function() {
    if (login_username.value && login_password.value) {
        home.style.display = "none";
        test.style.display = "block";
        loadQueston(0);
    }
});

hint.addEventListener("click", function() {
    report[questonnumber].hint = true;
    alert(hintText);
});

submit.addEventListener("click", function() {
    if (answer.value) {
        report[questonnumber].answer = answer.value;
        if (questons[questonnumber].answers.indexOf(answer.value.toLowerCase()) == -1) {
            report[questonnumber].correct = false;
        } else {
            report[questonnumber].correct = true;
        }
        if (questonnumber == questons.length - 1) {
            //alert("ur done");
            test.style.display = "none";
            var score = 0;
            for (i = 0; i < report.length; i++) {
                if (report[i].correct) score++;
            }
            reportMeter.max = report.length;
            reportMeter.value = score;
            reportText.innerHTML = (score / report.length) * 100 + "%";
            download.href = URL.createObjectURL(new Blob([JSON.stringify(report)]));
            download.download = "report " + new Date() + ".json";
            reportNode.style.display = "block";
        } else {
            loadQueston(questonnumber + 1);
        }
    }
});