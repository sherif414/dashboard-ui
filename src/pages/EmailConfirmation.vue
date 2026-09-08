<template>
  <div class="w-full max-w-27rem my-auto flex flex-col items-center text-center p-6 sm:p-8 surface-1 rounded-md border border-gray-2 dark:border-dark-3 gap-3 shadow-sm typo-clr-base">
    <h1 class="typo-lg font-bold typo-clr-base">Check your email</h1>
    <p class="typo-sm typo-clr-muted">
      We sent you a verification link. Confirm your account and
      <router-link class="typo-clr-primary hover:underline font-medium" to="/login">login</router-link>
      to continue.
    </p>
  </div>
</template>
