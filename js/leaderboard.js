/* ==========================================================
   Mercurial FX — Leaderboard engine
   Renders the five weekly boards, the podium, the rank list
   and the live season countdown.

   Handles are pseudonymous by design: this layer never
   receives a legal name. Only admin surfaces resolve a
   handle to an identity.
   ========================================================== */

(function (window) {
  "use strict";

  // ----------------------------------------------------------
  // Board definitions
  // ----------------------------------------------------------
  // `format` decides how a raw score is rendered:
  //   "count"  -> 47          (+ unit label)
  //   "naira"  -> the naira value, thousands separated
  var BOARDS = {
    "deposit-count": {
      label: "Deposits",
      unit: "confirmed deposits",
      format: "count",
      blurb: "Ranked by how many deposits settled this week — not how large they were."
    },
    "deposit-volume": {
      label: "Deposit Volume",
      unit: "deposited",
      format: "naira",
      blurb: "Ranked by total confirmed deposit value that cleared the 48-hour settlement window."
    },
    "withdrawal-count": {
      label: "Withdrawals",
      unit: "confirmed payouts",
      format: "count",
      blurb: "Ranked by how many payouts we completed for this member this week."
    },
    "withdrawal-volume": {
      label: "Withdrawal Volume",
      unit: "paid out",
      format: "naira",
      blurb: "Total value paid out and confirmed received. Proof that money leaves the platform."
    },
    "referrals": {
      label: "Referrals",
      unit: "qualified referrals",
      format: "count",
      blurb: "Only counts referrals who completed KYC and made at least one confirmed transaction."
    }
  };

  // ----------------------------------------------------------
  // Seed data — replace with an API response of the same shape.
  // Each row: [handle, score, movement]
  //   movement: positive = climbed N places, negative = dropped,
  //             0 = unchanged, null = new entry this week
  // ----------------------------------------------------------
  var DATA = {
    "deposit-count": [
      ["SwiftKite482", 47, 2], ["NovaTiger019", 44, -1], ["AmberFalcon77", 41, 5],
      ["QuietRaven920", 38, 0], ["CoralHawk236", 36, -2], ["IronPetrel845", 33, 3],
      ["VividOsprey31", 31, null], ["LunarStag608", 29, -4], ["EmberFinch174", 27, 1],
      ["GoldenLynx553", 26, 0], ["RapidHeron388", 24, -3], ["SilentOtter742", 22, 6],
      ["BoldMarlin615", 21, -1], ["CrimsonElk209", 19, 2], ["MintFalcon864", 18, 0],
      ["PolarWren437", 16, -5], ["SolarBadger51", 15, null], ["DuskOrca783", 13, 1],
      ["JadeCondor126", 12, -2], ["RustyPuma490", 11, 0]
    ],
    "deposit-volume": [
      ["NovaTiger019", 18450000, 1], ["GoldenLynx553", 16200000, 3], ["SwiftKite482", 14875000, -2],
      ["TitanSable301", 12300000, 0], ["QuietRaven920", 11640000, 4], ["AmberFalcon77", 9820000, -1],
      ["IronPetrel845", 8455000, 2], ["EchoMagpie974", 7910000, null], ["CoralHawk236", 7240000, -3],
      ["VelvetIbis658", 6580000, 1], ["LunarStag608", 5930000, -2], ["BoldMarlin615", 5410000, 0],
      ["ArcticShrike27", 4870000, 5], ["EmberFinch174", 4320000, -1], ["MintFalcon864", 3960000, 2],
      ["RapidHeron388", 3540000, -4], ["DuskOrca783", 3120000, 0], ["SilentOtter742", 2780000, 1],
      ["PolarWren437", 2410000, -2], ["JadeCondor126", 2050000, null]
    ],
    "withdrawal-count": [
      ["AmberFalcon77", 22, 4], ["SilentOtter742", 20, 1], ["QuietRaven920", 19, -2],
      ["SwiftKite482", 17, 0], ["EmberFinch174", 16, 3], ["CrimsonElk209", 15, -1],
      ["NovaTiger019", 14, -3], ["MintFalcon864", 13, 2], ["GoldenLynx553", 12, 0],
      ["VividOsprey31", 11, null], ["CoralHawk236", 10, -2], ["DuskOrca783", 9, 1],
      ["IronPetrel845", 9, -1], ["RapidHeron388", 8, 0], ["PolarWren437", 7, 2],
      ["LunarStag608", 7, -4], ["BoldMarlin615", 6, 0], ["SolarBadger51", 5, null],
      ["RustyPuma490", 5, 1], ["JadeCondor126", 4, -1]
    ],
    "withdrawal-volume": [
      ["GoldenLynx553", 14720000, 2], ["TitanSable301", 12980000, -1], ["AmberFalcon77", 11350000, 3],
      ["NovaTiger019", 10240000, 0], ["EchoMagpie974", 8790000, null], ["QuietRaven920", 8110000, -2],
      ["SwiftKite482", 7460000, 1], ["VelvetIbis658", 6820000, 4], ["IronPetrel845", 6150000, -3],
      ["CoralHawk236", 5540000, 0], ["SilentOtter742", 4930000, 2], ["EmberFinch174", 4380000, -1],
      ["ArcticShrike27", 3850000, null], ["CrimsonElk209", 3410000, 1], ["MintFalcon864", 2970000, -2],
      ["BoldMarlin615", 2540000, 0], ["DuskOrca783", 2180000, 3], ["RapidHeron388", 1840000, -1],
      ["PolarWren437", 1520000, 0], ["RustyPuma490", 1290000, null]
    ],
    "referrals": [
      ["VividOsprey31", 31, 6], ["SwiftKite482", 28, -1], ["SilentOtter742", 24, 2],
      ["GoldenLynx553", 21, 0], ["AmberFalcon77", 19, -2], ["QuietRaven920", 17, 3],
      ["EmberFinch174", 15, 1], ["NovaTiger019", 14, -3], ["CrimsonElk209", 12, 0],
      ["MintFalcon864", 11, null], ["CoralHawk236", 10, -1], ["IronPetrel845", 9, 2],
      ["DuskOrca783", 8, 0], ["LunarStag608", 7, -4], ["BoldMarlin615", 6, 1],
      ["RapidHeron388", 6, 0], ["SolarBadger51", 5, null], ["PolarWren437", 4, -2],
      ["JadeCondor126", 4, 1], ["RustyPuma490", 3, 0]
    ]
  };

  // The signed-in member's standing, per board. Dashboard only.
  // `rank` is their true position even when outside the visible top 20.
  var ME = {
    handle: "QuietRaven920",
    standings: {
      "deposit-count":     { rank: 4, score: 38,       movement: 0 },
      "deposit-volume":    { rank: 5, score: 11640000, movement: 4 },
      "withdrawal-count":  { rank: 3, score: 19,       movement: -2 },
      "withdrawal-volume": { rank: 6, score: 8110000,  movement: -2 },
      "referrals":         { rank: 6, score: 17,       movement: 3 }
    }
  };

  // ----------------------------------------------------------
  // Formatting helpers
  // ----------------------------------------------------------
  var NAIRA = "₦";

  function formatScore(value, format) {
    var n = Number(value).toLocaleString("en-NG");
    return format === "naira" ? NAIRA + n : n;
  }

  // Two-letter monogram from a handle: "SwiftKite482" -> "SK"
  function initials(handle) {
    var caps = handle.match(/[A-Z]/g);
    if (caps && caps.length >= 2) {
      return caps[0] + caps[1];
    }
    return handle.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  }

  function movementMarkup(movement) {
    if (movement === null || typeof movement === "undefined") {
      return '<span class="lb-move lb-move--flat">NEW</span>';
    }
    if (movement > 0) {
      return '<span class="lb-move lb-move--up">&#9650; ' + movement + '</span>';
    }
    if (movement < 0) {
      return '<span class="lb-move lb-move--down">&#9660; ' + Math.abs(movement) + '</span>';
    }
    return '<span class="lb-move lb-move--flat">&ndash;</span>';
  }

  var ESCAPES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return ESCAPES[c];
    });
  }

  // ----------------------------------------------------------
  // Season countdown — resets Monday 00:00 West Africa Time
  // ----------------------------------------------------------
  var WAT_OFFSET_MS = 60 * 60 * 1000; // UTC+1

  function nextResetFrom(now) {
    // Work in WAT regardless of the viewer's own timezone.
    var wat = new Date(now.getTime() + WAT_OFFSET_MS);
    var daysUntilMonday = (8 - wat.getUTCDay()) % 7 || 7;
    var reset = Date.UTC(
      wat.getUTCFullYear(),
      wat.getUTCMonth(),
      wat.getUTCDate() + daysUntilMonday,
      0, 0, 0
    );
    return new Date(reset - WAT_OFFSET_MS); // back to real UTC
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function startCountdown(el) {
    if (!el) return;

    function tick() {
      var now = new Date();
      var diff = nextResetFrom(now) - now;
      if (diff < 0) diff = 0;

      var days  = Math.floor(diff / 86400000);
      var hours = Math.floor(diff / 3600000) % 24;
      var mins  = Math.floor(diff / 60000) % 60;
      var secs  = Math.floor(diff / 1000) % 60;

      el.textContent = (days > 0 ? days + "d " : "") +
        pad(hours) + "h " + pad(mins) + "m " + pad(secs) + "s";
    }

    tick();
    setInterval(tick, 1000);
  }

  // ----------------------------------------------------------
  // Rendering
  // ----------------------------------------------------------
  function renderPodium(rows, board) {
    if (rows.length < 3) return "";

    // Visual order: 2nd, 1st, 3rd — the winner sits centre and taller.
    var order = [
      { row: rows[1], place: 2 },
      { row: rows[0], place: 1 },
      { row: rows[2], place: 3 }
    ];

    return order.map(function (entry) {
      return '<div class="lb-podium-card lb-podium-card--' + entry.place + '">' +
          '<div class="lb-medal">' + entry.place + '</div>' +
          '<div class="lb-avatar">' + escapeHtml(initials(entry.row[0])) + '</div>' +
          '<div class="lb-podium-body">' +
            '<div class="lb-handle">' + escapeHtml(entry.row[0]) + '</div>' +
            '<div class="lb-value">' + formatScore(entry.row[1], board.format) + '</div>' +
            '<span class="lb-unit">' + escapeHtml(board.unit) + '</span>' +
          '</div>' +
        '</div>';
    }).join("");
  }

  function renderRows(rows, board, startRank) {
    return rows.map(function (row, i) {
      return '<div class="lb-row">' +
          '<div class="lb-rank">' + (startRank + i) + '</div>' +
          '<div class="lb-identity">' +
            '<div class="lb-avatar">' + escapeHtml(initials(row[0])) + '</div>' +
            '<div class="lb-handle">' + escapeHtml(row[0]) + '</div>' +
          '</div>' +
          '<div class="lb-metric">' +
            '<div class="lb-value">' + formatScore(row[1], board.format) + '</div>' +
            movementMarkup(row[2]) +
          '</div>' +
        '</div>';
    }).join("");
  }

  function renderYou(boardKey, board) {
    var standing = ME.standings[boardKey];
    if (!standing) return "";

    return '<div class="lb-rank">' + standing.rank + '</div>' +
      '<div class="lb-identity">' +
        '<div class="lb-avatar">' + escapeHtml(initials(ME.handle)) + '</div>' +
        '<div>' +
          '<span class="lb-you-tag">Your position</span>' +
          '<div class="lb-handle">' + escapeHtml(ME.handle) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="lb-metric">' +
        '<div class="lb-value">' + formatScore(standing.score, board.format) + '</div>' +
        movementMarkup(standing.movement) +
      '</div>';
  }

  // ----------------------------------------------------------
  // Public initialiser
  // ----------------------------------------------------------
  function init(options) {
    options = options || {};

    var root = document.querySelector(options.root || ".lb-scope");
    if (!root) return;

    var showYou  = Boolean(options.showYou);
    var tabs     = root.querySelectorAll(".lb-tab");
    var podiumEl = root.querySelector("[data-lb-podium]");
    var listEl   = root.querySelector("[data-lb-list]");
    var blurbEl  = root.querySelector("[data-lb-blurb]");
    var youEl    = root.querySelector("[data-lb-you]");

    function select(boardKey) {
      var board = BOARDS[boardKey];
      var rows  = DATA[boardKey] || [];
      if (!board) return;

      if (blurbEl) {
        blurbEl.textContent = board.blurb;
      }

      if (podiumEl) {
        podiumEl.innerHTML = renderPodium(rows, board);
      }

      if (listEl) {
        listEl.innerHTML = rows.length > 3
          ? renderRows(rows.slice(3), board, 4)
          : '<div class="lb-empty">No entries yet this week. Be the first.</div>';
      }

      if (showYou && youEl) {
        youEl.innerHTML = renderYou(boardKey, board);
        youEl.hidden = false;
      }

      Array.prototype.forEach.call(tabs, function (tab) {
        var active = tab.getAttribute("data-lb-board") === boardKey;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener("click", function () {
        select(tab.getAttribute("data-lb-board"));
      });
    });

    startCountdown(root.querySelector("[data-lb-clock]"));
    select(options.initialBoard || "deposit-count");
  }

  window.MercurialLeaderboard = {
    init: init,
    BOARDS: BOARDS,
    DATA: DATA,
    ME: ME
  };
})(window);
