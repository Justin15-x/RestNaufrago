const supabase = window.supabase.createClient(
  "https://bdngrgorvczujhkyzbkl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbmdyZ29ydmN6dWpoa3l6YmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzYxMzAsImV4cCI6MjA4NjUxMjEzMH0.yjvRSBZ33VkL0JYgUtHUDNYybA2GUFvMMOnyyYbYOUo"
);

export async function checkSession() {
    const { data: { user } } = await supabase.auth.getUser();

    if(!user){
        window.location = "login.html";
        return null;
    }

    return user;
}