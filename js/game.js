function setup(){
    console.log("Starting");
    mobile = detectMob();
    console.log(mobile);
    var mobile_url = "mobile_beta.html";
    if(mobile && (document.getElementById("id").innerText != "mobile"))
        location.href = mobile_url
    // Load test file
}


function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function to_pinyin(x){
    var output = "";
    for(var i=0; i<x.length; i++){
        
        var c = pinyin_dict[x[i]]
        if(c!=undefined)

            output += c + " ";
    }
    return output;
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
    if(!detectMob())
        document.getElementById("helper").className = "float_right out_shadow";
    document.getElementById("exp").className = "exp_inv";
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
            if(document.getElementById("id").innerText == "mobile")document.getElementById("question").className = "correct_mobile";
        }
        else{
            document.getElementById("exp").innerText = to_pinyin(document.getElementById("question").innerText);
            document.getElementById("question").className = "wrong";
            if(document.getElementById("id").innerText == "mobile")document.getElementById("question").className = "wrong_mobile";
            url = "https://translate.google.com/?hl=en#view=home&op=translate&sl=auto&tl=en&text=" + document.getElementById("question").innerText
            
            if(!detectMob())
                document.getElementById("helper").className = "float_right_come out_shadow jiggle_help";
            document.getElementById("exp").className = "exp";
            setTimeout(fade_away, 2000);
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
    if(document.getElementById("id").innerText == "mobile")
        document.getElementById("question").className = "chinese_mobile";
    full = test_data.split('\n').length;
    rand_id = Math.floor(Math.random() * full);
    data = test_data.split('\n')[rand_id];
    ques = data.split(",")[0];
    ans = data.split(",")[1];

    // console.log(ques.length);

    if(ques.length > 1){
        rand_id = Math.floor(Math.random() * 3);
        console.log("Split" + rand_id)
        if(rand_id != 2){
            ques = ques[rand_id];
            ans = ans.split(" ")[rand_id];
        }
    }
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
    if(!detectMob())
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
