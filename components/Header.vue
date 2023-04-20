<template>
  <b-navbar type="light" variant="light" style="display: flex; justify-content: space-between;">
    <b-navbar-nav>
        <li class="nav-item">
          <NuxtLink to="/" class="nav-link"><img src="lawnotation-logo.svg" alt="logo" style="width: 200px"></NuxtLink>
        </li>
        <li class="nav-item" style="align-self: center">
          <NuxtLink to="/imports" class="nav-link">Imports</NuxtLink>
        </li>
        <li class="nav-item" style="align-self: center">
          <NuxtLink to="/get-structure" class="nav-link">Get Structure</NuxtLink>
        </li>
    </b-navbar-nav>
    <b-navbar-nav>
        <NuxtLink to="/labels" class="ddd-nav-link btn btn-secondary">Labels</NuxtLink>
    </b-navbar-nav>
  </b-navbar>
</template>
