import { tweetsData } from "./data.js";
const tweetInput = document.getElementById("tweet-input");
const tweetBtn = document.getElementById("tweet-btn");

// log out new tweet
tweetBtn.addEventListener("click", function () {
  console.log(tweetInput.value);
});

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
  }
});

// console.log(e.target.dataset.reply);
// console.log(e.target.dataset.retweet);

// get ahold of correct tweet and increment it's likes count
function handleLikeClick(tweetId) {
  // filter tweet uuid that matches clicked icon, will return array with obj, get only obj with [0]
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId
  )[0];
  // increment likes in the obj, only if isLiked is false, or decrement it
  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  // display new count on page
  render();
}

// retweet
function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId
  )[0];
  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

// build html for feed
function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    // set up icon classes to conditionally render
    let likedClass = "";
    let retweetedClass = "";
    if (tweet.isLiked) {
      likedClass = "liked";
    } else if (tweet.isRetweeted) {
      retweetedClass = "retweeted";
    }
    // check if tweet has replies
    let repliesHtml = "";
    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
              <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
              </div>
          </div>
      </div>`;
      });
    }
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
                        <i class="fa-solid fa-heart ${likedClass}" 
                        data-like="${tweet.uuid}"></i>
                    </span>
                    <span class="tweet-detail">
                        ${tweet.retweets}
                        <i class="fa-solid fa-retweet ${retweetedClass}" 
                        data-retweet="${tweet.uuid}"></i>
                    </span>
                </div>   
            </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
    </div>`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
