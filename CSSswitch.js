// This script was written to provide the ability to switch out stylesheets to help with the proofing process.
// The original intention was to help with accessibility proofing but this may be of use in other areas.
// A number of revisions may take place over time in terms of adding new stylesheets and options.
(function() {

    // the minimum version of jQuery we want
    var v = "1.11.1";

    // check prior inclusion and version
    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        var done = false;
        var script = document.createElement("script");
        script.src = "https://code.jquery.com/jquery-1.11.1.min.js";
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                initMyBookmarklet();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {

        document.onload = initMyBookmarklet();

    }

    function checkAttributes(attr1, attr2) {
      return $("svg").has(attr1) && $("svg").has(attr2);
    }

    function initMyBookmarklet() {
        (window.myBookmarklet = function() {
            jQuery(document).ready(function($) {
                // This is the path to the css files so that the script has something to change.
                // This tool is being actively used for Learn Screen restructuring so do not change the path on this copy of the script.
                // If you would like feel free to make a new copy of the script and  and create your own path.
                var path = "https://e46e1737ba3a0d67f27e-a38089a2eebfe71c27e41f4491122aec.ssl.cf2.rackcdn.com/testing/bookmarklets/proofingToolConcept/css/";
                $("head").append("<link id=\"switchStyle\" rel=\"stylesheet\" href=\"\"/>");

                // Create a container for the buttons inside the body of the HTML document.
                $("body").prepend("<div id=\"buttonContainer\"></div>");

                // Create all the buttons inside the button container div.
                // Give them an id that is the file name of the stylesheet they are swapping to.
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"svgtempstyles\">SVG Proofing</button>");
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"mathml\">MathML Structure</button>");
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"mathmlinvisops\">MathML Invisible Operators</button>");
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"mathmlops\">MathML Token Elements</button>");
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"alttext\">Show Alttext</button>");
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"labelreading\">Show Sr-only text</button>");
                // $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"findissues\">Find issues</button>");
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"htmlinline\">Inline HTML</button>");
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"htmlstructure\">HTML Structure</button>");
                // $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"newwpcss\">New WP CSS</button>");
                // $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"oldstyles\">Old WP CSS</button>");
                $("#buttonContainer").prepend("<button class=\"styleToggle\" id=\"clearstyles\">Clear Styles</button>");




                $("button").click(function() {
                    // If the indicator of how many instances of alttext is still on the screen remove it
                    if ($(".remove")) {
                        $(".remove").remove();
                    }
                    if ($(".removeLeavecontent")) {
                        anchors = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "a");
                        $(anchors).children().unwrap();
                        $(anchors).remove();
                        $(".removeLeavecontent > *").unwrap();
                        $(".removeLeavecontent").remove();
                    }
                    if ($(".removeClass")) {
                        $(".removeClass").removeClass();
                    }
                    // remove the math highlighting class when you click a button.
                    $(".mathhighlighting").removeAttr("class");
                    // Find the id of the button that has been clicked.
                    var id = $(this).attr("id");

                    // Create the full path to the stylesheet.
                    var fullPath = path + id + ".css";


                    // In the case that the clear styles button is clicked set the path to null.
                    if (id === "clearstyles") {
                        fullPath = "";
                        $("head").prepend("<link class=\"remove\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css\" rel=\"stylesheet\">");
                        $("head").prepend("<script class=\"remove\" src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js\"></script>");
                    }

                    switch (id) {
                        // In the event that the findissues button was clicked add a paragraph that shows how many instance of old alt text there are.
                        case "findissues":
                            var alttextNumber = $(".equationAltText-lc");
                            $("#buttonContainer").append("<p class=\"remove\" id=\"alttextFinder\">Instances of old alt text:" + alttextNumber.length + "</p>");

                            break;

                            //Change the path in the event of new styles
                        case "newwpcss":
                            $("head").prepend("<link class=\"remove\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css\" rel=\"stylesheet\">");
                            $("head").prepend("<script class=\"remove\" src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js\"></script>");
                            if ($("#screenContainer").length == 0) {
                                $("body").wrapInner("<div class=\"removeLeavecontent\" id=\"screenContainer\"></div>");
                            }
                            break;

                            //Change the path in the event of old styles.
                        case "oldstyles":
                            fullPath = path + "newwpcss.css";
                            console.log($("#screenContainer"));
                            if ($("#screenContainer").length) {
                                $("#screenContainer").addClass("removeLeavecontent");
                                $("#screenContainer").wrap("<div id=\"screenContainer\" class=\"removeLeavecontent\"></div>");

                            } else {
                                $("body").wrapInner("<div id=\"screenContainer\" class=\"removeLeavecontent\"></div>");
                                $("#screenContainer").wrap("<div id=\"screenContainer\" class=\"removeLeavecontent\"></div>");
                            }
                            break;

                            // Create a toggle button for the math element highlighting
                        case "mathml":
                            $("math").addClass("mathhighlighting");
                            $(".math").addClass("mathhighlighting");
                            $("#buttonContainer").append('<span class="remove"><br /><label for="mathmlToggle">Show math element highlight:</label><input id="mathmlToggle" type="checkbox" /></span>');
                            $("#mathmlToggle").change(function() {
                                if ($(this).prop("checked")) {
                                    $("math").removeClass("mathhighlighting");
                                    $(".math").removeClass("mathhighlighting");
                                } else {
                                    $("math").addClass("mathhighlighting");
                                    $(".math").addClass("mathhighlighting");
                                }
                            });
                            break;

                            // Create a toggle to show borders around token MathML elements.
                            // This can be used to find areas where multiple mn elements are being used when there should be one.
                        case "mathmlops":
                            $("#buttonContainer").append('<span class="remove"><br /><label for="mathmlToggle">Show token element borders:</label><input id="mathmlToggle" type="checkbox" /></span>');
                            $("#mathmlToggle").change(function() {
                                if ($(this).prop("checked")) {
                                    $("mn, mo, mi, mtext").addClass("addBorder");
                                    $(".mn, .mo, .mi, .mtext").addClass("addBorder");
                                } else {
                                    $("mn, mo, mi, mtext").removeAttr("class");
                                    $(".mn, .mo, .mi, .mtext").removeClass("addBorder");
                                }
                            });
                            break;

                            // Create a toggle to show elements that have an invisible operator to the right of them.
                        case "mathmlinvisops":
                            $("mo").each(function() {
                                if (this.textContent === "\u2061") {
                                    $(this).addClass("invisFunctionApp");
                                }
                                if (this.textContent === "\u2062") {
                                    $(this).addClass("invisTimes");
                                }
                                if (this.textContent === "\u2063") {
                                    $(this).addClass("invisSeparator");
                                }
                                if (this.textContent === "\u2064") {
                                    $(this).addClass("invisAddition");
                                }
                            }).addClass("removeClass")
                            break;
                            // If the show alltext button is selected then add a span containing the alltext before the current math element.
                        case "alttext":
                            $("img[alt]:not(#profileImageThumbnail)").each(function() {
                                var alternativetext = $(this).attr("alt");
                                $(this).before('<span class="showAltText remove">' + alternativetext + '</span>');
                            });
                            $("span[aria-label]").each(function() {
                                var alternativetext = $(this).attr("aria-label");
                                $(this).before('<span class="showAltText remove">' + alternativetext + '</span>');
                            });
                            $("math[alttext]").each(function() {
                                var alternativetext = $(this).attr("alttext");
                                $(this).before('<span class="showAltText remove">' + alternativetext + '</span>');
                            });
                            break;
                            // Label reading will grab the label information for inputs if it is in an aria-label and place it in a span before it.
                            // I also calls a style sheet that overrides the sr-only class
                            // for things that are not skip to content links.
                        case "labelreading":
                            $("[aria-label]:not(.MathJax)").each(function() {
                                var alternativetext = $(this).attr("aria-label");
                                $(this).before('<span class="showAltText remove">' + alternativetext + '</span>');
                            });
                            break;
                            // If the SVG the SVG Proofing button is pushed then we need to make areas on the screen for the alt text to live in.
                        case "svgtempstyles":
                            // Add id attributes on to each of the SVG documents in the page.
                            // Index is based on their appearance in document order.
                            $("svg").each(function(index) {
                                var id = "#image " + index;
                                $(this).attr("id", "image" + index);
                                $(this).after('<p class="remove"><b>description:</b> <span id="desc' + index + '"></span></p>');
                                $(this).after('<p class="remove"><b>title:</b> <span id="title' + index + '"></span></p>');

                            });

                            // Create the SVG a element and wrap the content of g elements that have
                            // a title element child.
                            var link = document.createElementNS("http://www.w3.org/2000/svg", "a");
                            if ($("svg").has("title") || $("svg").has("desc")) {
                                $("svg").wrapInner(link);
                            }

                            //$("svg").has("title","desc").wrapInner(link);
                            $("g").has("title","desc").wrapInner(link);

                            // Retrieve the SVG a elements and give them null destination.
                            // Apply the class to unwrap the a element and have it removed when
                            // another selection is made.
                            var anchors = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "a");
                            var loopTimer = anchors.length
                            for (i = 0; i < loopTimer; i++) {
                                anchors[i].setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "javascript:void(0)");
                                anchors[i].setAttributeNS("http://www.w3.org/2000/svg", "class", "removeLeavecontent");
                            }

                            // Provide the focus functionality of exposing the <title> and
                            // <desc> content outside of the SVG so it can be visually inspected.
                            $("svg a").focus(function() {
                                var svgId = $(this).parents("svg").attr("id");
                                var svgNumber = parseInt(svgId[svgId.length - 1]);
                                var titleId = "#title" + svgNumber;
                                var descId = "#desc" + svgNumber;
                                $(titleId).text("");
                                $(descId).text("");
                                var titleText = $(this).children("title").contents().clone();
                                var descText = $(this).children("desc").contents().clone();
                                $(titleId).append(titleText);
                                $(descId).append(descText);
                            });
                            break;
                    }

                    // Change the path of the stylesheet being used.
                    $("#switchStyle").attr("href", fullPath);


                });
            });
        })();
    }
})();