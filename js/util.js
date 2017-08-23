//This file relies on firebase, and jQuery

//Include this in any document needed above all script which use this, but below jQuery and firebase


//Allows us to create PostPreview() objects while staying consistent. This doesn't contain all of the posts data, just the data we need for the list. - xDest

function PostPreview() {
    this.title = "Post Title";
    this.author = "Post Author";
    this.date = "0101001100";
    this.replyCount = 0;
}

//Same thing as the previous, but this time to create a PostPreview() with all the data included
function PostPreview(title, author, date, replyCount) {
    this.title = title;
    this.author = author;
    this.date = date;
    this.replyCount = replyCount;
}


//Generates the html for a group item in sub forums
PostPreview.prototype.generateHTML = function() {
    var HTML = "";
    HTML+= "<div class=\"group-item\"><div class=\"post-list-title\"><a href=\"#\">" + this.title + "</a></div>";
    HTML+= "<div class=\"post-list-author\">" + this.author + "</div>";
    HTML+= "<div class=\"post-list-date\">" + convertDateToStr(this.date) + "</div>";
    HTML += "<div class=\"post-list-replies\"> Replies: " + this.replyCount + "</div></div>";
    return HTML;
}

//Post reply as an object
function PostReply(author, body, date) {
    this.author = author;
    this.body = body;
    this.date = date;
}


PostReply.prototype.generateHTML = function () {
    var HTML = "";
    HTML+="<div class=\"post-reply-wrap\">";
    HTML+="<div class=\"post-reply-body\">";
    HTML+=this.body;
    HTML+="</div>";
    HTML+="<div class=\"post-reply-footer\">";
    HTML+="<div class=\"post-reply-author\">";
    HTML+=this.author;
    HTML+="</div>";
    HTML+="<div class=\"post-reply-date\">";
    HTML+=convertDateToStr(this.date);
    HTML+="</div>";
    HTML+="</div>";
    HTML+="</div>";
}

//Full Post object containing the entire post and it's replies
function Post(title, author, date, replies, body) {
    this.title = title;
    this.author = author;
    this.date = date;
    this.replies = replies;
    this.body = body;
}

Post.prototype.generatePrimaryHTML = function() {
    var html = "";
    html+="<div class=\"post-header\">";
    html+="<div class=\"post-title\">";
    html+=this.title;
    html+="</div>";
    html+="<div class=\"post-author\">";
    html+=this.author;
    html+="</div>";
    html+="<div class=\"post-date\">";
    html+=convertDateToStr(this.date);
    html+="</div>";
    html+="</div>";
    html+="<div class=\"post-body\">";
    //Add thing here to convert short cuts into html
    html+=this.body;
    html+="</div>";
}

Post.prototype.generateReplyHTML = function() {
    if(replies == null)
        return "";
    allReplies = "";
    for (var i = 0; i < replies.length; i++) {
        allReplies+=replies[i].generateHTML;
    }
    return allReplies;
}

/* 
    Example post data
    title = "Hi - I'm xDest."
    author = "xDest"
    date = "0823171415"
    
    ===============
    
    The date is written as mmddyytttt where tttt is time in 24 hour time. 1415 is 2:15 pm
    
    - xDest
*/


//Function to convert dates like 0823171439 Into August 23, 2017 at 2:39 pm
//Does this using substring to split up the input
function convertDateToStr(str) {
    var nStr = "";
    var date = str;
    var monthN = Number(date.substr(0,2));
    var dayN = Number(date.substr(2,2));
    var yearN = Number(date.substr(4,2));
    var hourN = Number(date.substr(6,2));
    var minuteN = Number(date.substr(8,2));
    //alert(date.substr(0,2));
    var months = {"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"};
    //alert(months[Number(date.substr(0,2))]);
    var amPmStr = ((hourN > 11) ? "pm":"am");
    if(hourN > 12)
        hourN-=12;
    nStr+= months[monthN] + " " + dayN + ", 20" + yearN + " at " + hourN + ":" + ((minuteN < 10) ? "0"+minuteN:minuteN) + " " + amPmStr;
    return nStr;
}


/*
    A deferred function which calls the firebase database at the given location. 
    Retrieves the data from the location and returns it. It can be accessed through
    retrieveData..Location(loc).done(func (data) {}); where (data) is the data from the location.
    The data can either be an array, string, or anything else depending on the location
*/
function retriveDataPromiseAtLocation(location) {
    
    var $deferred = new $.Deferred();
    
    firebase.database().ref(location).once("value").then(function(data) {
        dataToReturn = data.val();
        $deferred.resolve(dataToReturn);
    });
    return $deferred.promise();
}


//This method *OVERRIDES* any previous written html in the element.
function insertHTMLToElement(newHTML, $location) {
    $location.html(newHTML);
}
