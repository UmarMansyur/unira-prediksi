<template>
    <button type="button" class="btn btn-sm btn-white p-2" @click="handleDelete">
        <i class="ti ti-trash fs-16"></i>
    </button>
</template>
<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import useAPI from '../composables/api';
import { toast } from 'vue3-toastify';
import Sweet from '../helpers/SweeetAlert2';

const props = defineProps({
    endpoint: {
        type: String,
        required: true
    },
    queryKey: {
        type: String,
        required: true
    },
});

const { deleteResource } = useAPI();

const deleteData = async () => {
    const response = await deleteResource(props.endpoint, true);
    if(response?.data) {
        toast.success('Data berhasil dihapus!');
    }
    return response?.data;
}

const queryClient = useQueryClient();

const mutation = useMutation({
    mutationFn: deleteData,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [props.queryKey] });
        // toast.success('Data berhasil dihapus!');
    },
    // onError: (error: any) => {
    //     toast.error(error.response.message || 'Gagal menghapus data!');
    // }
});

const handleDelete = () => {
    Sweet.confirm('Data yang dihapus tidak dapat dikembalikan! dan akan menghapus semua data yang berhubungan dengan data ini. Apakah ingin meneruskan?', () => {
        mutation.mutate();
    });

}

</script>