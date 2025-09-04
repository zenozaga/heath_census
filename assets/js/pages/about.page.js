export default async function AboutPage(app) {
  console.log("About Page initialized");

  customElements.define("team-member", TeamMember);
}

class TeamMember extends HTMLElement {
  constructor() {
    super();

    this.avatar = this.getAttribute("avatar");
    this.name = this.getAttribute("name");
    this.role = this.getAttribute("role");
    this.linkedin = this.getAttribute("linkedin");
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="team-member">
          <img src="/assets/images/${this.avatar}" alt="Team Member 1">
          <h3>${this.name}</h3>
          <p>${this.role}</p>

          <div class="team-member-social flex items-center gap-4">
             <a href="${this.linkedin}" target="_blank" class="flex items-center justify-center">
              <img src="/assets/icons/linkedin.svg" />
            </a>
          </div>
      </div>
    `;
  }
}
