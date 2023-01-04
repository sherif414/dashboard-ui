<template>
  <TransitionGroup
    enter-active-class="transition-all duration-200 absolute z-1"
    leave-active-class="transition-all duration-200 absolute z-1"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <slot></slot>
  </TransitionGroup>
</template>
