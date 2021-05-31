$("#searchBox").keydown(async (event) => {
    clearTimeout(timer);
    let textbox = $(event.target);
    let value = await textbox.val();
    let searchType = await textbox.data().search//relates to the data-search attr we added to the search box that is equal to the selectedTab, ie. posts or users
    timer = setTimeout(async () => {
        value = textbox.val().trim();
        if (value == "") {
            return $(".resultsContainer").html("")
        } else {
            search(value, searchType)
        }
    }, 1000)

})

function search(searchTerm, searchType) {
    let url = searchType == "posts" ? "/api/posts" : "/api/users"
    $.get(url, { search: searchTerm }, async (response) => {
        if (searchType == "users"){
            outputUsers(response, $(".resultsContainer"))
        } else {
        outputPosts(response, $(".resultsContainer"))
        }
    }).catch((err) => { console.log(err) })
}