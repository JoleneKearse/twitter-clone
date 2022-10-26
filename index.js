import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// set initial theme
const docTheme = document.getElementById("toggleTheme");
docTheme.setAttribute("data-theme", "light");

// event listeners
document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.id === "theme") {
    changeTheme();
  } else if (e.target.dataset.liked) {
    handleLikedClick(e.target.dataset.tweet, e.target.dataset.liked);
  } else if (e.target.dataset.retweeted) {
    handleRetweetedClick(e.target.dataset.tweet, e.target.dataset.retweeted);
  }
});

// FUNCTIONS
// change light/dark theme
function changeTheme() {
  if (docTheme.getAttribute("data-theme") === "light") {
    docTheme.setAttribute("data-theme", "dark");
  } else {
    docTheme.setAttribute("data-theme", "light");
  }
}

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

function handleLikedClick(originalTweet, replyId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === originalTweet
  )[0];
  const targetReplyObj = targetTweetObj.replies.filter(
    (reply) => reply.uuid === replyId
  )[0];
  if (targetReplyObj.isLiked) {
    targetReplyObj.likes--;
  } else {
    targetReplyObj.likes++;
  }
  targetReplyObj.isLiked = !targetReplyObj.isLiked;
  render();
}

// retweet
function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId
  )[0];
  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
    tweetsData.shift(targetTweetObj);
  } else {
    targetTweetObj.retweets++;
    tweetsData.unshift(targetTweetObj);
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleRetweetedClick(originalTweet, replyId) {
  console.log("clicked");
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === originalTweet
  )[0];
  const targetReplyObj = targetTweetObj.replies.filter(
    (reply) => reply.uuid === replyId
  )[0];
  if (targetReplyObj.isRetweeted) {
    targetReplyObj.retweets--;
    tweetsData.shift(targetReplyObj);
  } else {
    targetReplyObj.retweets++;
    tweetsData.unshift(targetReplyObj);
  }
}

// reply to display replies
function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

// new tweets
function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `./images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: `${tweetInput.value}`,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: `${uuidv4()}`,
    });
    render();
    tweetInput.value = "";
  }
}

// build html for feed
function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach((tweet) => {
    // set up icon classes to conditionally render
    let likedClass = "";
    let retweetedClass = "";
    if (tweet.isLiked) {
      likedClass = "liked";
    } else if (tweet.isRetweeted) {
      retweetedClass = "retweeted";
    }
    // tweetsData.forEach((reply) => {
    //   let likedClass = "";
    //   let retweetedClass = "";
    //   if (reply.isLiked) {
    //     likedClass = "liked";
    //   } else if (reply.isRetweeted) {
    //     retweetedClass = "retweeted";
    //   }
    // });
    // check if tweet has replies
    let repliesHtml = "";
    if (tweet.replies.length > 0) {
      tweet.replies.forEach((reply) => {
        repliesHtml += `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
              <div class="reply-content">
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
                <div class=reply-details>
                  <span class="reply-detail">
                    ${reply.replies.length}
                    <i class="fa-regular fa-comment-dots" data-tweet="${tweet.uuid}" data-replied="${reply.uuid}"></i>
                  </span>
                  <span class="reply-detail">
                    ${reply.likes}
                    <i class="fa-solid fa-heart ${likedClass}" data-tweet="${tweet.uuid}" data-liked="${reply.uuid}"></i>
                  </span>
                  <span class="reply-detail">
                    ${reply.retweets}
                    <i class="fa-solid fa-retweet ${retweetedClass}" data-tweet="${tweet.uuid}" data-retweeted="${reply.uuid}"></i>
                  </span>
                </div>
              </div>
          </div>
      </div>`;
      });
    }
    feedHtml += `
      <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div class="tweet-content">
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
