function setup(){
    console.log("Starting");
    mobile = detectMob();
    console.log(mobile);
    if(mobile)
        location.href = "mobile.html"
    // Load test file
}

var test_file = 0;
var test_data = 0;

var total_time = 0;
var current_answer = 0;
var total_score = 0;
var n = 0;

var url = 0;

var in_game = false;

const inputElement = document.getElementById("file");
inputElement.addEventListener("change", file_uploaded, false);

document.getElementById("answer")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("submitter").click();
    }
});


function file_uploaded() {
  const fileList = this.files; /* now you can work with the file list */
  var file_name = inputElement.value.split("\\");
  file_name = file_name[file_name.length - 1];
  console.log(file_name);
  document.getElementById("file_browse").innerText = file_name;
  document.getElementById("upload_button").disabled = false;
  
}
function end_game(){
    in_game = false
    document.getElementById("final_score").innerText = document.getElementById("score").innerText;
    document.getElementById("final_time").innerText = document.getElementById("avg_time").innerText;
    document.getElementById("final_samples").innerText = n;
    document.getElementById("end_game").style.display = "block";
}

function help(){
    console.log("Help");
    window.open(url,"Ratting","width=550,height=170,left=150,top=100%,toolbar=0,status=0")
}

function fade_away(){
    document.getElementById("helper").className = "float_right out_shadow";
}

function submit(){
    
    if(in_game){
        var ans = document.getElementById("answer").value.toLowerCase();
        if(ans==""){
            return 0;
        }
        
    
        if(ans==current_answer){
            total_score += 100;
            document.getElementById("question").className = "correct";

        }
        else{
            document.getElementById("question").className = "wrong";
            url = "https://translate.google.com/?hl=en#view=home&op=translate&sl=auto&tl=en&text=" + document.getElementById("question").innerText
            
            document.getElementById("helper").className = "float_right_come out_shadow jiggle_help";
            setTimeout(fade_away, 3000);
        }

        n +=1;
        
        var score = Math.floor(total_score/n);
        document.getElementById("score").innerText = score;
        document.getElementById("avg_time").innerText = Math.floor(total_time/n);

        setTimeout(next_question, 1000);
    }
}

function next_question(){
    document.getElementById("question").className = "chinese";
    full = test_data.split('\n').length;
    rand_id = Math.floor(Math.random() * full);
    data = test_data.split('\n')[rand_id];
    ques = data.split(",")[0];
    ans = data.split(",")[1];

    // Reset timer
    document.getElementById("time").innerText = 0;
    // Set answer
    current_answer = ans;
    // Set question
    document.getElementById("question").innerText = ques;
    document.getElementById("answer").value = "";
    
}

function timer_tick(){
    if(in_game){
        total_time +=1;
        document.getElementById("time").innerText = parseInt(document.getElementById("time").innerText) + 1;
    }
}



function upload_test(){
    console.log("Uploading");
    test_file = document.getElementById("file").files[0];
    document.body.requestFullscreen()
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        test_data = textFromFileLoaded;
        console.log(test_data);
        // document.getElementById("layover").disabled = true;
        document.getElementById("layover").style.display = "none";
        in_game = true;
        setInterval(timer_tick, 1000);
        next_question();
        
    };
    fileReader.readAsText(test_file, "UTF-8");
}

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}