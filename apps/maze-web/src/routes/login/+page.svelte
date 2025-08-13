<script lang="ts">
import { goto } from "$app/navigation";
import { Button, Input, Icons, Card } from "@nadir/solara";

let email = $state("");
let password = $state("");
let isLoading = $state(false);
let errorMessage = $state("");

const handleSubmit = async (e: Event) => {
	e.preventDefault();

	if (!email || !password) {
		errorMessage = "Please fill in all fields";
		return;
	}

	isLoading = true;
	errorMessage = "";

	try {
		// TODO: Implement actual authentication logic here
		// For now, we'll simulate a login process
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Mock successful login
		console.log("Login attempt:", { email, password });

		// Redirect to home page after successful login
		goto("/");
	} catch (error) {
		errorMessage = "Login failed. Please try again.";
		console.error("Login error:", error);
	} finally {
		isLoading = false;
	}
};

const handleBackToHome = () => {
	goto("/");
};
</script>

<svelte:head>
	<title>Login - Neon Quest</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center px-4 ">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">

			<h1 class="text-2xl font-bold text-white mb-2">Welcome Back</h1>
			<p class="text-gray-300">Sign in to continue your adventure</p>
		</div>
		<Card.Root variant="neon" class="p-8">
			<form onsubmit={handleSubmit} class="space-y-6">
				<Input 
					id="email"
					type="email"
					variant="neon"
					label="Email Address"
					bind:value={email}
					placeholder="Enter your email"
					leftIcon={Icons.MailIcon}
					error={errorMessage && !email ? "Email is required" : ""}
				/>

				<Input 
					id="password"
					type="password"
					variant="neon"
					label="Password"
					bind:value={password}
					placeholder="Enter your password"
					leftIcon={Icons.LockIcon}
					error={errorMessage && !password ? "Password is required" : ""}
				/>

				<Button 
					type="submit"
					variant="solid-neon"
					class="w-full py-3"
					disabled={isLoading}
				>
					{#if isLoading}
						<Icons.LoaderIcon class="w-4 h-4 mr-2 animate-spin" />
						Signing In...
					{:else}
						<Icons.LogInIcon class="w-4 h-4 mr-2" />
						Sign In
					{/if}
				</Button>
			</form>

			<!-- Additional Options -->
			<div class="mt-6 text-center space-y-4">
				<div class="text-sm text-gray-400">
					<button type="button" class="text-cyan-400 hover:text-cyan-300 transition-colors underline">
						Forgot your password?
					</button>
				</div>
				
				<div class="text-sm text-gray-400">
					Don't have an account? 
					<a href="/register" class="text-cyan-400 hover:text-cyan-300 transition-colors">
						Sign up here
					</a>
				</div>
			</div>
		</Card.Root>
		<div class="mt-6 text-center">
			<Button 
				variant="outline" 
				onclick={handleBackToHome}
				class="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
			>
				<Icons.GamepadIcon class="w-4 h-4 mr-2" />
				Continue as Guest
			</Button>
		</div>
	</div>
</main>

