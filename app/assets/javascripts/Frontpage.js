(function() {
    var S = ".",
        B;

    function I(V, Z, X, W) {
        var Y;
        if (V !== true) {
            Z = Z || "";
            X = X || "";
            W = W || 0;
            Y = "Assertion";
            if ((X.length > 0) && (W > 0)) {
                Y += " at " + X + ":" + W
            }
            Y += " failed";
            if (Z.length > 0) {
                Y += ": " + Z
            }
            throw new Error(Y)
        }
    }

    function H(Y, X, V) {
        var W, Z;
        if (window.console && window.console.log && (Y.length > 0)) {
            X = X || "";
            V = V || 0;
            W = new Date();
            Z = "[" + W.toString() + "]";
            if ((X.length > 0) && (V > 0)) {
                Z += " " + X + ":" + V
            }
            Z += ": " + Y;
            window.console.log(Z)
        }
    }

    function K(W) {
        var V = typeof(W);
        if ("object" === V) {
            if (null === W) {
                V = "null"
            } else {
                if (W instanceof Array) {
                    V = "array"
                }
            }
        } else {
            if ("number" === V) {
                if (isFinite(W)) {
                    V = "number"
                } else {
                    if (isNaN(W)) {
                        V = "NaN"
                    } else {
                        if (Infinity === W) {
                            V = "+Infinity"
                        } else {
                            if (-Infinity === W) {
                                V = "-Infinity"
                            } else {
                                V = ""
                            }
                        }
                    }
                }
            } else {
                if ("boolean" === V) {
                    V = "bool"
                }
            }
        }
        return V
    }

    function E(V) {
        return ("array" === K(V))
    }

    function P(V) {
        return ("bool" === K(V))
    }

    function U(V) {
        return ("number" === K(V))
    }

    function Q(V) {
        return ("function" === K(V))
    }

    function N(W) {
        var V = false;
        if ("number" === K(W)) {
            V = (false === /\./.test(W))
        }
        return V
    }

    function T(V) {
        return ("null" === K(V))
    }

    function L(V) {
        return ("object" === K(V))
    }

    function M(V) {
        return ("string" === K(V))
    }

    function J(V) {
        return ("undefined" === K(V))
    }

    function R(Y, X) {
        var V = "\t";
        X = X || 1;

        function W(f, e) {
            var c, b, Z, d, a;
            if (f < X) {
                c = K(e);
                b = "";
                if (("array" === c) || ("object" === c)) {
                    for (a = 0; a < f; a += 1) {
                        b += V
                    }
                }
                switch (c) {
                    case "array":
                        d = e.length;
                        if (d > 0) {
                            Z = "[\n";
                            for (a = 0; a < d; a += 1) {
                                Z += b + V + a + ": " + W(f + 1, e[a]) + "\n"
                            }
                            Z += b + "]"
                        } else {
                            Z = "[]"
                        }
                        break;
                    case "bool":
                        Z = (true === e) ? "true" : "false";
                        break;
                    case "function":
                        Z = "<function>";
                        break;
                    case "+Infinity":
                    case "-Infinity":
                    case "NaN":
                        Z = c;
                        break;
                    case "null":
                        Z = "null";
                        break;
                    case "number":
                        Z = e + (N(e) ? "::int" : "::float");
                        break;
                    case "object":
                        Z = "";
                        for (a in e) {
                            Z += b + V + a + ": " + W(f + 1, e[a]) + "\n"
                        }
                        if (Z.length > 0) {
                            Z = "{\n" + Z + b + "}"
                        } else {
                            Z = "{}"
                        }
                        break;
                    case "string":
                        Z = '"' + e + '"';
                        break;
                    case "undefined":
                        Z = "undefined";
                        break;
                    default:
                        Z = "<unknown>"
                }
            } else {
                Z = "..."
            }
            return Z
        }
        return W(0, Y)
    }
    B = {
        Debug: {
            assert: I,
            log: H,
            dump: R
        }
    };

    function G(X) {
        var V = {},
            Y, W;
        if (L(X) || E(X)) {
            for (Y in X) {
                if (X.hasOwnProperty(Y)) {
                    V[Y] = G(X[Y])
                }
            }
        } else {
            V = X
        }
        return V
    }

    function O(W, V) {
        var Y;
        V = V || {};

        function X(f, d, e) {
            var b, Z, c, g, a, h;
            b = d.split(S);
            Z = f;
            for (c = 0, g = b.length; c < g; c += 1) {
                a = b[c];
                if ((Z.hasOwnProperty && (!Z.hasOwnProperty(a))) || (undefined === Z[a])) {
                    Z[a] = {}
                }
                Z = Z[a]
            }
            for (a in e) {
                if (e.hasOwnProperty(a)) {
                    h = e[a];
                    if (L(h)) {
                        X(Z, a, h)
                    } else {
                        Z[a] = G(h)
                    }
                }
            }
            return Z
        }
        Y = X(window, W, V);
        return Y
    }

    function A(W, Y, X) {
        var a, V, Z, b;
        a = W.split(S);
        V = a.pop();
        Z = O(a.join(S));
        Z[V] = Y;
        for (b in X) {
            if (X.hasOwnProperty(b)) {
                Y.prototype[b] = G(X[b])
            }
        }
    }

    function D(Z, Y) {
        var W = false,
            X, V;
        if (E(Y)) {
            for (X = 0, V = Y.length; X < V; X += 1) {
                if (Z === Y[X]) {
                    W = true;
                    break
                }
            }
        }
        return W
    }

    function F(Y) {
        var V, W = /\s/,
            X;
        V = Y.replace(/^\s\s*/, "");
        X = V.length;
        while ((X > 0) && W.test(V.charAt(X - 1))) {
            X -= 1
        }
        V = V.slice(0, X);
        return V
    }

    function C(W) {
        var V;
        V = F(W);
        V = V.replace(/\s+/, " ");
        return V
    }
    O("CK", B);
    O("CK", {
        namespace: O,
        defineClass: A,
        inArray: D,
        trim: F,
        collapse: C,
        DataType: {
            isArray: E,
            isBool: P,
            isFloat: U,
            isFunction: Q,
            isInt: N,
            isNull: T,
            isObject: L,
            isString: M,
            isUndefined: J
        },
        Models: {},
        Serialisers: {},
        Formatters: {},
        Apps: {}
    })
}());
(function() {
    var C = {},
        A = {
            dialog: []
        };

    function D(F, E) {
        if (ga) {
            ga("send", "event", "Videos", F, E)
        }
    }

    function B(E) {
        if (E && E.hasOwnProperty("stopVideo")) {
            E.stopVideo()
        }
    }
    C.asyncLoadYouTubeIFrameAPI = function() {
        var E = document.createElement("script"),
            F = document.getElementsByTagName("script")[0];
        E.src = "//www.youtube.com/iframe_api";
        F.parentNode.insertBefore(E, F)
    };
    C.createPlayer = function(M, F) {
        var L, G = $("#" + M),
            J, E, K, H = false;
        J = G.find(".video-player");
        E = J.get(0);
        K = document.location.protocol + "//" + document.location.hostname;

        function I(O) {
            var P = G.find(".video-thumbnail");
            if (P.size()) {
                G.find("span.play-video").css("display", "inline-block");
                P.click(function() {
                    O.target.playVideo();
                    $(this).fadeOut("slow")
                })
            }
        }

        function N(O) {
            switch (O.data) {
                case YT.PlayerState.PLAYING:
                    if (A.dialog.hasOwnProperty(M) && !A.dialog[M].isOpen) {
                        setTimeout(function() {
                            B(O.target)
                        }, 500)
                    } else {
                        if (!H) {
                            D("Played", M)
                        }
                        H = true
                    }
                    break;
                case YT.PlayerState.ENDED:
                    D("Ended", M);
                    break;
                default:
                    break
            }
        }
        L = new YT.Player(E, {
            width: F.width.toString(),
            height: F.height.toString(),
            videoId: F.video_id,
            playerVars: {
                enablejsapi: 1,
                modestbranding: 1,
                rel: 0,
                origin: K,
                autoplay: 0,
                frameborder: 0,
                wmode: "transparent"
            },
            events: {
                "onReady": I,
                "onStateChange": N
            }
        });
        return L
    };
    C.createPopupPlayer = function(E, F) {
        var H = $("#" + E),
            I, L, G, K, J;
        K = H.find(".video-player-container");
        J = K.attr("id");
        I = $(".show-" + E);
        L = H.find(".hide-dialog a");
        A.dialog[J] = {
            "isOpen": false
        };
        K.css({
            "width": F.width,
            "height": F.height
        });
        H.dialog({
            width: F.width + 40,
            height: "auto",
            modal: true,
            autoOpen: false,
            draggable: false,
            resizable: false,
            dialogClass: "yt-dialog"
        });
        G = this.createPlayer(J, F);
        H.bind("dialogclose", function(M, N) {
            B(G)
        });
        I.click(function() {
            A.dialog[J].isOpen = true;
            H.dialog("open")
        });
        L.click(function() {
            A.dialog[J].isOpen = false;
            H.dialog("close")
        })
    };
    CK.namespace("CK.Apps", {
        YouTubeVideo: C
    })
}());
(function() {
    var A = null,
        I = null,
        K = null,
        L = null,
        F = 1;

    function G(Q, M, R) {
        var O = "Carousel",
            P = null;
        try {
            if (R) {
                ga("send", "event", O, Q, M, P, {
                    "nonInteraction": "1"
                })
            } else {
                ga("send", "event", O, Q, M, P)
            }
        } catch (N) {}
    }

    function C() {
        if (F > 1) {
            K.prevSlide.removeClass("inactive")
        } else {
            K.prevSlide.addClass("inactive")
        }
        if (F < L) {
            K.nextSlide.removeClass("inactive")
        } else {
            K.nextSlide.addClass("inactive")
        }
    }

    function J(O) {
        var M = $("#carousel-navigation"),
            P, N;
        P = M.find(".move-to-slide:first");
        M.html("");
        $(O).each(function(Q) {
            N = P.clone();
            if ((Q + 1) === F) {
                N.addClass("active")
            }
            M.append(N)
        });
        M.css("visibility", "visible")
    }

    function E(N, P) {
        var Q = N - 1,
            O, M;
        O = $(K.slides.get(Q)).attr("id");
        M = Q * K.carousel.width();
        if ((N !== F) && (N > 0 && N <= L)) {
            K.gotoSlide.removeClass("active");
            $(K.gotoSlide.get(Q)).addClass("active");
            G("Change Slide", P, false);
            G("View Slide", O, false);
            if (null !== I && I.hasOwnProperty(F) && I[F].hasOwnProperty("stopVideo")) {
                I[F].stopVideo()
            }
            K.slider.animate({
                "left": "-" + M
            }, 500);
            F = N;
            C()
        }
    }

    function B() {
        var M = $(A);
        K = {
            carousel: M,
            slides: M.find(".slide"),
            slider: M.find("#carousel-slider"),
            prevSlide: M.find("#carousel-prev-slide"),
            nextSlide: M.find("#carousel-next-slide"),
            gotoSlide: M.find("#carousel-navigation .move-to-slide"),
            videoThumbnail: M.find(".video-thumbnail"),
            captionButtonLinks: M.find(".caption a.btn")
        };
        return K
    }

    function H(M) {
        M.prevSlide.click(function() {
            var N = F - 1;
            E(N, "Previous")
        });
        M.nextSlide.click(function() {
            var N = F + 1;
            E(N, "Next")
        });
        M.gotoSlide.click(function() {
            var N = $(this).index() + 1;
            E(N, "Dot")
        });
        M.videoThumbnail.click(function(O) {
            var N = $(this).parents(".slide:first").attr("id");
            G("Interaction: " + N, "Play video", false)
        });
        M.captionButtonLinks.click(function(Q) {
            var N = $(this).parents(".slide:first").attr("id"),
                P = $(this).attr("href"),
                O = $(this).text();
            G("Interaction: " + N, O, false);
            Q.preventDefault();
            setTimeout(function() {
                window.location.href = P
            }, 100)
        })
    }

    function D(N, M) {
        A = N;
        I = M;
        $(document).ready(function() {
            var Q, P, O;
            Q = $(N).find(".slide");
            L = Q.size();
            J(Q);
            P = B();
            H(P);
            O = $(Q.get(0)).attr("id");
            G("View Slide", O, true)
        })
    }
    CK.namespace("CK.Apps", {
        Carousel: D
    })
}());
(function() {
    function B(E, D, C) {
        $(E).click(function(H) {
            var F = $(this).attr("href");
            try {
                ga("send", "event", "Outbound Links", D, C);
                H.preventDefault()
            } catch (G) {}
        })
    }

    function A() {
        $(document).ready(function() {
            var E = $('form#food_search input[name="name"]'),
                F = $("#dd-feature"),
                I = $("#dd-headline"),
                C = $("#dd-image"),
                H = $("#dd-body"),
                G = $("#dd-more"),
                J = $("#cfcc-kindle-link"),
                D = $("#cfcc-ipad-link");
            E.focus();
            B(F, "Diabetes Digest - Feature Title", "link");
            B(I, "Diabetes Digest - Headline", "link");
            B(C, "Diabetes Digest - Image", "link");
            B(H, "Diabetes Digest - Body", "link");
            B(G, "Diabetes Digest - Read More", "link");
            B(J, "Kindle - CKCC", "link");
            B(D, "iPad - CKCC", "link")
        })
    }
    CK.namespace("CK.Apps", {
        Frontpage: A
    })
}());
CK.Apps.Frontpage();
