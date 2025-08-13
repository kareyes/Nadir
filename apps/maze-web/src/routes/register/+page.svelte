<script lang="ts">
import { goto } from "$app/navigation";
import { Button, Input, Icons, Card } from "@nadir/solara";

let email = $state("");
let password = $state("");
let confirmPassword = $state("");
let username = $state("");
let isLoading = $state(false);
let errorMessage = $state("");

const handleSubmit = async (e: Event) => {
	e.preventDefault();
	
	if (!email || !password || !confirmPassword || !username) {
		errorMessage = "Please fill in all fields";
		return;
	}

	if (password !== confirmPassword) {
		errorMessage = "Passwords do not match";
		return;
	}

	if (password.length < 6) {
		errorMessage = "Password must be at least 6 characters long";
		return;
	}

	isLoading = true;
	errorMessage = "";

	try {
		// TODO: Implement actual registration logic here
		// For now, we'll simulate a registration process
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// Mock successful registration
		console.log("Registration attempt:", { email, username, password });
		
		// Redirect to login page after successful registration
		goto("/login");
	} catch (error) {
		errorMessage = "Registration failed. Please try again.";
		console.error("Registration error:", error);
	} finally {
		isLoading = false;
	}
};

const handleBackToLogin = () => {
	goto("/login");
};

const handleBackToHome = () => {
	goto("/");
};
</script>

<svelte:head>
	<title>Register - Neon Quest</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<!-- Header with logo and back button -->
		<div class="text-center mb-8">
			<Button 
				variant="ghost" 
				size="icon" 
				onclick={handleBackToHome}
				class="absolute top-4 left-4 text-white hover:text-cyan-400"
				aria-label="Back to home"
			>
				<Icons.ArrowLeftIcon />
			</Button>
			
			<img 
				src="/logo.png" 
				alt="Neon Quest Logo" 
				class="mx-auto mb-4 w-48 h-auto drop-shadow-[0_0_16px_#00e0ff]" 
			/>
			<h1 class="text-2xl font-bold text-white mb-2">Join the Quest</h1>
			<p class="text-gray-300">Create your account to start your adventure</p>
		</div>

		<!-- Registration Form -->
		<Card.Root variant="neon" class="p-8">
			<form onsubmit={handleSubmit} class="space-y-6">
				<Input 
					id="username"
					type="text"
					variant="neon"
					label="Username"
					bind:value={username}
					placeholder="Choose a username"
					rightIcon={Icons.UserIcon}
					required
					error={errorMessage && !username ? "Username is required" : ""}
				/>

				<Input 
					id="email"
					type="email"
					variant="neon"
					label="Email Address"
					bind:value={email}
					placeholder="Enter your email"
					rightIcon={Icons.MailIcon}
					required
					error={errorMessage && !email ? "Email is required" : ""}
				/>

				<Input 
					id="password"
					type="password"
					variant="neon"
					label="Password"
					bind:value={password}
					placeholder="Create a password"
					rightIcon={Icons.LockIcon}
					description="Must be at least 6 characters long"
					required
					error={errorMessage && !password ? "Password is required" : password && password.length < 6 ? "Password must be at least 6 characters long" : ""}
				/>

				<Input 
					id="confirmPassword"
					type="password"
					variant="neon"
					label="Confirm Password"
					bind:value={confirmPassword}
					placeholder="Confirm your password"
					rightIcon={Icons.LockIcon}
					required
					error={errorMessage && !confirmPassword ? "Please confirm your password" : confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
				/>

				<Button 
					type="submit"
					variant="solid-neon"
					class="w-full py-3"
					disabled={isLoading}
				>
					{#if isLoading}
						<Icons.LoaderIcon class="w-4 h-4 mr-2 animate-spin" />
						Creating Account...
					{:else}
						<Icons.UserPlusIcon class="w-4 h-4 mr-2" />
						Create Account
					{/if}
				</Button>
			</form>

			<!-- Additional Options -->
			<div class="mt-6 text-center">
				<div class="text-sm text-gray-400">
					Already have an account? 
					<Button 
						variant="link"
						onclick={handleBackToLogin}
						class="text-cyan-400 hover:text-cyan-300 transition-colors"
					>
						Sign in here
					</Button>
				</div>
			</div>
		</Card.Root>

		<!-- Guest Play Option -->
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

<style>
	/* Add any additional custom styles here if needed */
</style>
