// Add an event listener to button1
document.getElementById('button1').addEventListener('click', getJson);

// Function to get json data from a local JSON file
function getJson() {
  document.getElementById('button1').innerHTML = "Loading";
  document.getElementById('button1').style.pointerEvents = "none";
  input = document.getElementById("myText").value;
  input = input.trim();
  var n = input.lastIndexOf('/');
  input = input.substring(n + 1);
  if(input.includes('?')){
    input = input.substring(0, input.indexOf('?'));
  }
  var link_id = input;
  fetch('https://tweetemotion.herokuapp.com/tweet/' + link_id, {mode: 'cors'})
      .then(res => res.json())
      .then(data => {
        if(link_id != data.tweet_id){
          throw new Error('Invalid Tweet Link');
        }
        // Displaying to the UI
        let tweet_text = data.tweet_text;
        let tweet_label = data.tweet_label;
        let tweet_id = "https://twitter.com/twitter/status/" + String(data.tweet_id);
        document.getElementById('tweet_label').innerHTML = tweet_label;
        document.getElementById('tweet_text').innerHTML = tweet_text;
        document.getElementById('tweet_label').onclick = function() {
          window.open(tweet_id);
        };
        document.getElementById('errordiv').style.display="none";
        document.getElementById('outputdiv').style.display="block";
        document.getElementById('tweet_label').style.display="block";
        if(tweet_label == "Positive"){
          document.getElementById('tweet_label').style.color="green";
          document.getElementById('tweet_label').style.borderColor="green";
          document.getElementById('outputdiv').style.boxShadow="0 0 10px green";
        }
        else if(tweet_label == "Negative"){
          document.getElementById('tweet_label').style.color="red";
          document.getElementById('tweet_label').style.borderColor="red";
          document.getElementById('outputdiv').style.boxShadow="0 0 10px red";
        }
        else{
          document.getElementById('tweet_label').style.color="black";
          document.getElementById('tweet_label').style.borderColor="black";
          document.getElementById('outputdiv').style.boxShadow="0 0 10px black";
        }
        document.getElementById('button1').innerHTML = "Get Emotion";
        document.getElementById('button1').style.pointerEvents = "";
      })
      .catch(err => {
        console.log(err);

        // Displaying to the UI
        document.getElementById('outputdiv').style.display="none";
        document.getElementById('tweet_label').style.display="none";
        document.getElementById('errordiv').style.display="block";
        document.getElementById('errordiv').innerHTML = err;
        document.getElementById('button1').innerHTML = "Get Emotion";
        document.getElementById('button1').style.pointerEvents = "";


      });
}