const { WeElement, h, render, define } = Omi;

const COLORS = ["red", "green", "blue", "yellow"];
const COLOR_SYMBOLS = {
  red: "❤️",
  green: "💚",
  yellow: "💛",
  blue: "💙"
};

const store = {
  data: {
    currentSequence: [],
    colorStatus: {
      red: false,
      green: false,
      yellow: false,
      blue: false
    },
    userClicks: [],
    currentScore: 0,
    difficulty: 1000
  },

  generateSequence() {
    this.data.currentSequence.push(COLORS[this.getRandomInt(COLORS.length)]);

    if (this.data.currentScore > 0) {
      this.play();
    } else {
      console.log(
        `🕵️‍♂️🕵️‍♀️ PSSST! There is a game inside this webpage...\nClick the ${
          COLOR_SYMBOLS[this.data.currentSequence[0]]
        } tile on the Microsoft logo to play!`
      );
    }
  },

  clickColor(color) {
    this.data.userClicks.push(color);

    if (this.checkCorrect()) {
      this.data.userClicks = [];

      if (this.data.difficulty > 100) {
        this.data.difficulty -= 100;
      }

      this.data.currentScore++;

      console.log(
        `Simon says..."correct!" 🎉 Your score is`,
        this.data.currentScore
      );
      this.lightUp();
      this.generateSequence();
    }
  },

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },

  timer(ms) {
    return new Promise(res => setTimeout(res, ms));
  },

  checkCorrect() {
    let matching = true;
    let sequence =
      this.data.userClicks[this.data.userClicks.length - 1] ===
      this.data.currentSequence[this.data.userClicks.length - 1];

    if (!sequence) {
      this.reset();
    }

    for (let i = 0; i < this.data.currentSequence.length; i++) {
      if (this.data.userClicks[i] !== this.data.currentSequence[i]) {
        matching = false;
        break;
      }
    }

    return matching;
  },

  reset() {
    console.log(`😢 Game Over! Refresh to play again.`);
    this.data.currentSequence = [];
    this.data.userClicks = [];
    this.data.currentScore = 0;
    this.data.difficulty = 1000;
    this.generateSequence();
  },

  async play() {
    await this.timer(2000);

    for (var i = 0; i < this.data.currentSequence.length; i++) {
      this.data.colorStatus[this.data.currentSequence[i]] = true;
      await this.timer(this.data.difficulty);
      this.data.colorStatus[this.data.currentSequence[i]] = false;
      await this.timer(this.data.difficulty / 2);
    }
  },

  async lightUp() {
    let t = 150;
    this.data.colorStatus.red = true;
    await this.timer(t);
    this.data.colorStatus.red = false;
    this.data.colorStatus.green = true;
    await this.timer(t);
    this.data.colorStatus.green = false;
    this.data.colorStatus.yellow = true;
    await this.timer(t);
    this.data.colorStatus.yellow = false;
    this.data.colorStatus.blue = true;
    await this.timer(t);
    this.data.colorStatus.blue = false;
    this.data.colorStatus.red = true;
    await this.timer(t);
    this.data.colorStatus.red = false;
  },

  changeTheme() {
    if (theme && theme.changeTo) {
      theme.changeTo("msdos");
    }
  }
};

class Logo extends WeElement {
  static get data() {
    return {
      colorStatus: {},
      currentScore: 0
    };
  }

  install() {
    this.store.generateSequence();
  }

  css() {
    return `
      .logo-link {
        display: block;
        width: 4rem;
        height: 4rem;
        margin: var(--large-space) auto;
      }

      .logo {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        width: 100%;
        margin: 0;
      }

      .logo-tile {
        display: block;
        width: 45%;
        height: 45%;
        margin: 2.5%;
        outline: 1px solid transparent;
        animation: var(--logo-tiles-in-animation);
      }

      .winner {
        display: block;
        margin: auto;
        text-align: center;
      }

      .logo-tile--red {
        background-color: var(--brand-red);
        transition: 150ms;
      }

      .logo-tile--largered {
        background-color: var(--brand-red);
        transform: scale(1.2) translateY(-3px);
        transition: 150ms;
      }

      .logo-tile--red:active {
        transform: scale(0.8);
      }

      .logo-tile--green {
        background-color: var(--brand-green);
        animation-delay: var(--logo-tiles-in-delay);
        transition: 150ms;
      }

      .logo-tile--largegreen {
        background-color: var(--brand-green);
        transform: scale(1.2) translateY(-3px);
        animation-delay: var(--logo-tiles-in-delay);
        transition: 150ms;
      }

      .logo-tile--green:active {
        transform: scale(0.8);
      }

      .logo-tile--blue {
        background-color: var(--brand-blue);
        animation-delay: calc(var(--logo-tiles-in-delay) * 2);
        transition: 150ms;
      }

      .logo-tile--largeblue {
        background-color: var(--brand-blue);
        transform: scale(1.2) translateY(-3px);
        animation-delay: calc(var(--logo-tiles-in-delay) * 2);
        transition: 150ms;
      }

      .logo-tile--blue:active {
        transform: scale(0.8);
      }

      .logo-tile--yellow {
        background-color: var(--brand-yellow);
        animation-delay: calc(var(--logo-tiles-in-delay) * 3);
        transition: 150ms;
      }

      .logo-tile--largeyellow {
        background-color: var(--brand-yellow);
        transform: scale(1.2) translateY(-3px);
        animation-delay: calc(var(--logo-tiles-in-delay) * 3);
        transition: 150ms;
      }

      .logo-tile--yellow:active {
        transform: scale(0.8);
      }

      @keyframes logo-tiles-in {
        0% {
          opacity: 0;
          filter: grayscale(1) hue-rotate(100deg);
        }
        25% {
          opacity: 1;
        }
        50% {
          opacity: 1;
        }
        55% {
          opacity: 0;
        }
        60% {
          opacity: 1;
          filter: grayscale(1) hue-rotate(100deg);
        }
        100% {
          opacity: 1;
          filter: grayscale(0) hue-rotate(0deg);
        }
      }

      @keyframes logo-tiles-hover {
        from {
          filter: hue-rotate(0deg);
        }
        to {
          filter: hue-rotate(360deg);
        }
      }
    `;
  }

  getTileClass(color, status) {
    return `logo-tile logo-tile--${status ? "large" : ""}${color}`;
  }

  getWinner() {
    const isWinner = this.store.data.currentScore >= 2;

    if (isWinner) {
      this.store.changeTheme();
    }

    return isWinner;
  }

  render() {
    const { colorStatus } = this.store.data;
    const isWinner = this.getWinner();

    return h("header", {}, [
      h(
        "div",
        {
          className: "logo-link",
          title: "Microsoft Website"
        },
        [
          h(
            "div",
            {
              className: "logo",
              role: "img",
              ariaLabel: "Microsoft Logo"
            },
            [
              COLORS.map(color =>
                h("span", {
                  className: this.getTileClass(color, colorStatus[color]),
                  onClick: () => this.store.clickColor(color)
                })
              )
            ]
          )
        ]
      ),
      isWinner &&
        h(
          "span",
          {
            className: "winner"
          },
          "🎊 Simon says...A winner is you! 🎊"
        )
    ]);
  }
}

define("microsoft-logo", Logo);
render(h("microsoft-logo"), document.getElementById("app"), store);
