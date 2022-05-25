// Add an event listener to button1
document.getElementById("button1").addEventListener("click", getJson);
document.getElementById("button2").addEventListener("click", getStat);

// Function to get json data from a local JSON file
function getJson() {
  document.getElementById("button1").innerHTML = "Loading";
  document.getElementById("button1").style.pointerEvents = "none";
  input = document.getElementById("myText").value;
  input = input.trim();
  var n = input.lastIndexOf("/");
  input = input.substring(n + 1);
  if (input.includes("?")) {
    input = input.substring(0, input.indexOf("?"));
  }
  var link_id = input;
  fetch("https://tweetemotion.herokuapp.com/tweet/" + link_id, { mode: "cors" })
    .then((res) => res.json())
    .then((data) => {
      if (link_id != data.tweet_id) {
        throw new Error("Invalid Tweet Link");
      }
      // Displaying to the UI
      let tweet_text = data.tweet_text;
      let tweet_label = data.tweet_label;
      let tweet_id =
        "https://twitter.com/twitter/status/" + String(data.tweet_id);
      document.getElementById("tweet_label").innerHTML = tweet_label;
      document.getElementById("tweet_text").innerHTML = tweet_text;
      document.getElementById("tweet_label").onclick = function () {
        window.open(tweet_id);
      };
      document.getElementById("errordiv").style.display = "none";
      document.getElementById("outputdiv").style.display = "block";
      document.getElementById("tweet_label").style.display = "block";
      if (tweet_label == "Positive") {
        document.getElementById("tweet_label").style.color = "green";
        document.getElementById("tweet_label").style.borderColor = "green";
        document.getElementById("outputdiv").style.boxShadow = "0 0 10px green";
      } else if (tweet_label == "Negative") {
        document.getElementById("tweet_label").style.color = "red";
        document.getElementById("tweet_label").style.borderColor = "red";
        document.getElementById("outputdiv").style.boxShadow = "0 0 10px red";
      } else {
        document.getElementById("tweet_label").style.color = "black";
        document.getElementById("tweet_label").style.borderColor = "black";
        document.getElementById("outputdiv").style.boxShadow = "0 0 10px black";
      }
      document.getElementById("button1").innerHTML = "Get Emotion";
      document.getElementById("button1").style.pointerEvents = "";
    })
    .catch((err) => {
      console.log(err);

      // Displaying to the UI
      document.getElementById("outputdiv").style.display = "none";
      document.getElementById("tweet_label").style.display = "none";
      document.getElementById("errordiv").style.display = "block";
      document.getElementById("errordiv").innerHTML = err;
      document.getElementById("button1").innerHTML = "Get Emotion";
      document.getElementById("button1").style.pointerEvents = "";
    });
}

function getStat() {
  document.getElementById("button2").innerHTML = "Loading";
  document.getElementById("button2").style.pointerEvents = "none";
  input = document.getElementById("myTopic").value;
  input = input.trim();
  inputtwo = document.getElementById("mySize").value;
  var topic_name = input;
  var topic_size = inputtwo;
  fetch(
    "https://tweetemotion.herokuapp.com/stat/" + topic_name + "/" + topic_size,
    { mode: "cors" }
  )
    .then((res) => res.json())
    .then((data) => {
      // Displaying to the UI
      let tweet_label = data.tag_score;
      if (tweet_label == "-9") {
        throw "Not Enough Tweets";
      }
      let tweet_array = data.tweet_list;
      let tweet_result_array = data.tweet_result;
      let lenght = tweet_array.length;
      let tweet_text = "";
      for (let i = 0; i < lenght; i++) {
        tweet_text +=
          "[" + tweet_result_array[i] + "] " + tweet_array[i] + "<br>";
      }
      console.log(tweet_array);
      console.log("<br>");
      console.log(tweet_result_array);
      console.log("<br>");
      console.log(tweet_text);
      let tweet_id =
        "https://twitter.com/twitter/status/" + String(data.tag_score);
      document.getElementById("tweet_label").innerHTML = tweet_label;
      document.getElementById("tweet_text").innerHTML = tweet_text;
      document.getElementById("tweet_label").onclick = function () {
        download(
          tweet_text.replaceAll("<br>", "\n"),
          "tweets.txt",
          "text/plain"
        );
      };
      document.getElementById("errordiv").style.display = "none";
      document.getElementById("outputdiv").style.display = "block";
      document.getElementById("tweet_label").style.display = "block";
      if (tweet_label > 6 && tweet_label < 10) {
        document.getElementById("tweet_label").style.color = "green";
        document.getElementById("tweet_label").style.borderColor = "green";
        document.getElementById("outputdiv").style.boxShadow = "0 0 10px green";
      } else if (tweet_label < 4 && tweet_label >= 0) {
        document.getElementById("tweet_label").style.color = "red";
        document.getElementById("tweet_label").style.borderColor = "red";
        document.getElementById("outputdiv").style.boxShadow = "0 0 10px red";
      } else {
        document.getElementById("tweet_label").style.color = "black";
        document.getElementById("tweet_label").style.borderColor = "black";
        document.getElementById("outputdiv").style.boxShadow = "0 0 10px black";
      }
      document.getElementById("button2").innerHTML = "Get Value";
      document.getElementById("button2").style.pointerEvents = "";
    })
    .catch((err) => {
      console.log(err);

      // Displaying to the UI
      document.getElementById("outputdiv").style.display = "none";
      document.getElementById("tweet_label").style.display = "none";
      document.getElementById("errordiv").style.display = "block";
      document.getElementById("errordiv").innerHTML = err;
      document.getElementById("button2").innerHTML = "Get Value";
      document.getElementById("button2").style.pointerEvents = "";
    });
}

// download function
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === "object") {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.download = factory();
  }
})(this, function () {
  return function download(data, strFileName, strMimeType) {
    var self = window, // this script is only for browsers anyway...
      defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
      mimeType = strMimeType || defaultMime,
      payload = data,
      url = !strFileName && !strMimeType && payload,
      anchor = document.createElement("a"),
      toString = function (a) {
        return String(a);
      },
      myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString,
      fileName = strFileName || "download",
      blob,
      reader;
    myBlob = myBlob.call ? myBlob.bind(self) : Blob;

    if (String(this) === "true") {
      //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
      payload = [payload, mimeType];
      mimeType = payload[0];
      payload = payload[1];
    }

    if (url && url.length < 2048) {
      // if no filename and no mime, assume a url was passed as the only argument
      fileName = url.split("/").pop().split("?")[0];
      anchor.href = url; // assign href prop to temp anchor
      if (anchor.href.indexOf(url) !== -1) {
        // if the browser determines that it's a potentially valid url path:
        var ajax = new XMLHttpRequest();
        ajax.open("GET", url, true);
        ajax.responseType = "blob";
        ajax.onload = function (e) {
          download(e.target.response, fileName, defaultMime);
        };
        setTimeout(function () {
          ajax.send();
        }, 0); // allows setting custom ajax headers using the return:
        return ajax;
      } // end if valid url?
    } // end if url?

    //go ahead and download dataURLs right away
    if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
      if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString) {
        payload = dataUrlToBlob(payload);
        mimeType = payload.type || defaultMime;
      } else {
        return navigator.msSaveBlob // IE10 can't do a[download], only Blobs:
          ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
          : saver(payload); // everyone else can save dataURLs un-processed
      }
    } //end if dataURL passed?

    blob =
      payload instanceof myBlob
        ? payload
        : new myBlob([payload], { type: mimeType });

    function dataUrlToBlob(strUrl) {
      var parts = strUrl.split(/[:;,]/),
        type = parts[1],
        decoder = parts[2] == "base64" ? atob : decodeURIComponent,
        binData = decoder(parts.pop()),
        mx = binData.length,
        i = 0,
        uiArr = new Uint8Array(mx);

      for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

      return new myBlob([uiArr], { type: type });
    }

    function saver(url, winMode) {
      if ("download" in anchor) {
        //html5 A[download]
        anchor.href = url;
        anchor.setAttribute("download", fileName);
        anchor.className = "download-js-link";
        anchor.innerHTML = "downloading...";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        setTimeout(function () {
          anchor.click();
          document.body.removeChild(anchor);
          if (winMode === true) {
            setTimeout(function () {
              self.URL.revokeObjectURL(anchor.href);
            }, 250);
          }
        }, 66);
        return true;
      }

      // handle non-a[download] safari as best we can:
      if (
        /(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(
          navigator.userAgent
        )
      ) {
        url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
        if (!window.open(url)) {
          // popup blocked, offer direct download:
          if (
            confirm(
              "Displaying New Document\n\nUse Save As... to download, then click back to return to this page."
            )
          ) {
            location.href = url;
          }
        }
        return true;
      }

      //do iframe dataURL download (old ch+FF):
      var f = document.createElement("iframe");
      document.body.appendChild(f);

      if (!winMode) {
        // force a mime that will download:
        url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
      }
      f.src = url;
      setTimeout(function () {
        document.body.removeChild(f);
      }, 333);
    } //end saver

    if (navigator.msSaveBlob) {
      // IE10+ : (has Blob, but not a[download] or URL)
      return navigator.msSaveBlob(blob, fileName);
    }

    if (self.URL) {
      // simple fast and modern way using Blob and URL:
      saver(self.URL.createObjectURL(blob), true);
    } else {
      // handle non-Blob()+non-URL browsers:
      if (typeof blob === "string" || blob.constructor === toString) {
        try {
          return saver("data:" + mimeType + ";base64," + self.btoa(blob));
        } catch (y) {
          return saver("data:" + mimeType + "," + encodeURIComponent(blob));
        }
      }

      // Blob but not URL support:
      reader = new FileReader();
      reader.onload = function (e) {
        saver(this.result);
      };
      reader.readAsDataURL(blob);
    }
    return true;
  }; /* end download() */
});
