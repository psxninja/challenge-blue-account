<template>
	<header class="appHeader">
		<img class="appHeader__logo" width="200" height="29.63" alt="Weather Now" src="../assets/img/logo.svg" />
		<h1 class="appHeader__title">Weather Now</h1>
	</header>
</template>

<script>
export default {
	name: 'MainHeader'
}
</script>

<style>
.appHeader {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 55px;
	background: #ffffff;
	box-shadow: var(--box-shadow);
}
.appHeader__title {
	display: block;
	width: 1px;
	height: 1px;
	overflow: hidden;
}
.appHeader__logo {
	width: 200px;
}
</style>
