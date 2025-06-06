const SUPABASE_URL = "https://cdkuwlmddbvgahadowwz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNka3V3bG1kZGJ2Z2FoYWRvd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1OTIzMTIsImV4cCI6MjA2MzE2ODMxMn0.z8M2fgghS59tJ16IxW97Jvq9uEg4NOBaZWov8iri7BY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateUserStatus() {
  const { data: { session } } = await supabase.auth.getSession();
  const container = document.getElementById("userStatus");
  if (!container) return;
  if (session && session.user) {
    container.innerHTML = `<span>${session.user.email}</span> | <a href="#" id="logoutLink">Logout</a>`;
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        window.location.reload();
      });
    }
  } else {
    container.innerHTML = `<a href="login.html">Login</a>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await updateUserStatus();
  supabase.auth.onAuthStateChange(() => updateUserStatus());
});
