<!-- <script lang="ts">
    import { signIn, signOut } from "@auth/sveltekit/client"
    // signIn() -> run the logic to sign in user, signIn("github") -> use the sign in with github logic
    // signOut() -> run the logic to sign out user
    import { page } from "$app/stores"
    // $page.data.session -> { user, image, etc. } AUTH session
    console.log($page.data.session) 
    let followerList: any = [];

    async function getFollowerList() {
        await fetch("https://api.github.com/user/followers", {
            headers: {
                Accept: "application/vnd.github+json",
                //@ts-ignore
                Authorization: "Bearer " + $page.data.session?.access_token,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        }).then((data) => {
            return data.json()
        }).then((data) => {
            console.log(data); // [ user1, user2, user3 ]
            followerList = data;
        })
    }
    console.log(followerList);
</script>


<div class="p-24">
    {#if $page.data.session}
        <h1>You are logged in</h1>
        {#if $page.data.session.user?.image}
            <img 
                src={$page.data.session.user.image}
                alt="User Profile"
                class="w-12 h-12"
            />
        {/if}
        <p>Signed in as {$page.data.session.user?.name}</p>
        <button on:click={() => signOut()} class="bg-blue-500 py-1 px-2 rounded text-white font-bold">Sign Out</button>
        <button on:click={() => getFollowerList()} class="bg-blue-800 py-1 px-2 rounded text-white font-bold">Get Followers List</button>
        <ul class="w-64">
            {#each followerList as item, index}
                <li id={"follower" + index} class="w-64">{item.login}</li>
            {/each}
        </ul>
    {:else}
        <h1>You are not logged in</h1>
        <button on:click={() => signIn("github")} class="bg-blue-500 py-1 px-2 rounded text-white font-bold">Sign in with GitHub</button>
    {/if}
</div> -->
















































<script lang="ts">
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import { supabase } from "../lib/supabaseClient.js"; // Adjust path based on your setup
    
    let followerList: any = [];

    // Function to fetch the GitHub follower list
    async function getFollowerList() {
        await fetch("https://api.github.com/user/followers", {
            headers: {
                Accept: "application/vnd.github+json",
                //@ts-ignore
                Authorization: "Bearer " + $page.data.session?.access_token,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        })
        .then((data) => data.json())
        .then((data) => {
            console.log(data); // [ user1, user2, user3 ]
            followerList = data;
        });
    }

    async function storeUserData() {
    const session = $page.data.session;
    if (!session?.user) {
        console.error("No user session available!");
        return;
    }

    const { user } = session;
    const { email, name } = user;

    try {
        const { data, error } = await supabase
            .from('USERS')  // Make sure the table is called 'USERS' in Supabase
            .insert([{ name, email }]);  // Insert the data into the USERS table

        if (error) {
            console.error("Error inserting user data:", error.message);
        } else {
            console.log("User data stored successfully:", data);
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}


    console.log(followerList);
</script>

<div class="p-24">
    {#if $page.data.session}
        <h1>You are logged in</h1>
        {#if $page.data.session.user?.image}
            <img 
                src={$page.data.session.user.image}
                alt="User Profile"
                class="w-12 h-12"
            />
        {/if}
        <p>Signed in as {$page.data.session.user?.name}</p>
        <button on:click={() => signOut()} class="bg-blue-500 py-1 px-2 rounded text-white font-bold">Sign Out</button>
        <button on:click={() => getFollowerList()} class="bg-blue-800 py-1 px-2 rounded text-white font-bold">Get Followers List</button>
        <button on:click={() => storeUserData()} class="bg-green-500 py-1 px-2 rounded text-white font-bold">Store User Data</button>
        <ul class="w-64">
            {#each followerList as item, index}
                <li id={"follower" + index} class="w-64">{item.login}</li>
            {/each}
        </ul>
    {:else}
        <h1>You are not logged in</h1>
        <button on:click={() => signIn("github")} class="bg-blue-500 py-1 px-2 rounded text-white font-bold">Sign in with GitHub</button>
    {/if}
</div>
