// ==UserScript==
// @name         rym crawler
// @namespace    http://tampermonkey.net/
// @version      2025-07-23
// @description  try to take over the world!
// @author       qujt
// @match        https://rateyourmusic.com/charts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    console.log('我要开始工作了，直到发现有pos1');
    let resultArr = [];
    let pos1 = document.getElementById("pos1");
    if (pos1) {
        getData()
    }

    // Your code here...
    function getData() {//首先获取当前被选中的页码
        let pageIndex = document.getElementsByClassName("ui_pagination_btn ui_pagination_number selected")[0].innerText
        console.log("当前页码:" + pageIndex)

        for (let i = 1; i <= 40; i++) {
            //专辑总排名
            let number = (pageIndex - 1) * 40 + i;

            let posE = document.getElementById("pos" + number);
            if (!posE) {
                //最后一页不足40
                break;
            }

            //专辑名
            let album = posE.getElementsByClassName("page_charts_section_charts_item_title")[0].innerText;

            //艺术家
            let artist = posE.getElementsByClassName("page_charts_section_charts_item_credited_text")[0].innerText;

            //发行日期
            let releaseDate = posE.getElementsByClassName("page_charts_section_charts_item_date")[0].innerText;


            let genresPrimary = ""
            //主风格
            let genresPrimaryE = posE.getElementsByClassName("page_charts_section_charts_item_genres_primary")[0];
            if (genresPrimaryE) {
                let genresPrimaryACe = genresPrimaryE.getElementsByTagName("a")
                //循环
                for (let j = 0; j < genresPrimaryACe.length; j++) {
                    genresPrimary += genresPrimaryACe[j].innerText + ",";
                }
                //去掉最后一个逗号
                genresPrimary = genresPrimary.substring(0, genresPrimary.length - 1);
            }


            //次要风格
            let genresSecondary = ""
            let genresSecondaryE = posE.getElementsByClassName("page_charts_section_charts_item_genres_secondary")[0];
            if (genresSecondaryE) {
                let genresSecondaryACe = genresSecondaryE.getElementsByTagName("a")
                for (let j = 0; j < genresSecondaryACe.length; j++) {
                    genresSecondary += genresSecondaryACe[j].innerText + ",";
                }
                //去掉最后一个逗号
                genresSecondary = genresSecondary.substring(0, genresSecondary.length - 1);
            }


            //平均分
            let average = posE.getElementsByClassName("page_charts_section_charts_item_details_average_num")[0].innerText;


            //打分人数
            let ratings = posE.getElementsByClassName("page_charts_section_charts_item_details_ratings")[0].innerText;
            //去掉各种空格换行
            ratings = ratings.replace(/\s/g, "");
            ratings = ratings.replace("/", "");

            //评论人数
            let reviews = posE.getElementsByClassName("page_charts_section_charts_item_details_reviews")[0].innerText;


            reviews = reviews.replace(/\s/g, "");

            let imageSrc = ""
            //专辑封面
            let imageDiv = posE.getElementsByClassName("page_charts_section_charts_item_image")[0]
            if (imageDiv) {
                let imageImg = imageDiv.getElementsByTagName("img")[0]
                if (imageImg) {
                    imageSrc = imageImg.getAttribute("src")
                }
            }

            //rym link
            let rymLink = posE.getElementsByClassName("page_charts_section_charts_item_image_link")[0].getAttribute("href");

            //组成一个json
            let json = {
                "number": number,
                "album": album,
                "artist": artist,
                "releaseDate": releaseDate,
                "genresPrimary": genresPrimary,
                "genresSecondary": genresSecondary,
                "average": average,
                "ratings": ratings,
                "reviews": reviews,
                "imageSrc": imageSrc,
                "rymLink": rymLink
            }
            resultArr.push(json)

        }
        //下一页页面可点击
        let nextPage = document.getElementsByClassName("ui_pagination_btn ui_pagination_next")[0];
        //如果nextPage 是 a 标签
        if (nextPage.tagName == "A") {
            nextPage.click();
            setTimeout(getData, 5000);
        } else {
            console.log("已到最后一页了")
            console.log(resultArr)
        }
    }
})();
