const form = document.querySelector("#registrationForm");
const statusMessage = document.querySelector("#formStatus");
const confirmation = document.querySelector("#confirmation");

function getFormPayload(formElement) {
  const data = new FormData(formElement);

  return {
    teamName: data.get("teamName"),
    captainName: data.get("captainName"),
    mobileNumber: data.get("mobileNumber"),
    whatsappNumber: data.get("whatsappNumber"),
    emailAddress: data.get("emailAddress"),
    organization: data.get("organization"),
    city: data.get("city"),
    numberOfPlayers: data.get("numberOfPlayers"),
    playingXi: data.get("playingXi"),
    substitutePlayers: data.get("substitutePlayers"),
    jerseyColour: data.get("jerseyColour"),
    teamLogoName: data.get("teamLogo")?.name || "",
    declaration: data.get("declaration") === "on"
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector("button[type='submit']");
  const payload = getFormPayload(form);

  statusMessage.className = "";
  statusMessage.textContent = "Submitting registration...";
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration could not be submitted.");
    }

    form.reset();
    statusMessage.textContent = "";
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    statusMessage.className = "error";
    statusMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});
