import { tweetsData } from "./data.js";
const tweetInput = document.getElementById("tweet-input");
const tweetBtn = document.getElementById("tweet-btn");

// log out new tweet
tweetBtn.addEventListener("click", function () {
  console.log(tweetInput.value);
});

// build html for feed
function getFeedHtml() {
  let feedHtml = ``;
  tweetsData.forEach(function (tweet) {
    feedHtml += `
      <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${tweet.handle}</p>
                <p class="tweet-text">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        ${tweet.replies.length}
                        <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    </span>
                    <span class="tweet-detail">
                        ${tweet.likes}
                        <i class="fa-solid fa-heart" data-like="${tweet.uuid}"></i>
                    </span>
                    <span class="tweet-detail">
                        ${tweet.retweets}
                        <i class="fa-solid fa-retweet" data-retweet="${tweet.uuid}"></i>
                    </span>
                </div>   
            </div>            
        </div>
    </div>`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
