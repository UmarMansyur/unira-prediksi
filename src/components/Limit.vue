<template>
    <div class="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
        <select class="form-select" aria-label="Default select example" @change="changeLimit" :value="limit">
            <option v-for="(item, index) in limits" :key="index" :value="item">
                {{ item }} Data
            </option>
        </select>

    </div>
</template>

<script setup lang="ts">
const { limit, setLimit } = defineProps<{
    limit: number;
    setLimit: (limit: number) => void;
}>();

const limits = [5, 10, 25, 50, 100];

const changeLimit = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setLimit(parseInt(target.value));
}
</script>

<style scoped lang="css">
.btn-white>i {
    color: #000 !important;
}

.btn-white:hover {
    background-color: #f8f9fa !important;
    color: #000 !important;
    border-color: #e0e0e0 !important;
}

.dropdown .dropdown-toggle {
    background-color: #fff !important;
    color: #000 !important;
    border-color: #e0e0e0 !important;
}

.dropdown .dropdown-toggle:after {
    display: inline-block;
    margin-inline-start: 0.25rem;
    vertical-align: 0;
    content: "\f078";
    font-family: "Font Awesome 5 Free";
    border: 0;
    font-size: 0.6rem;
    font-weight: 600;
    color: #000 !important;
}
</style>