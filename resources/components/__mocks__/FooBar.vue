<script setup>
import {
    useCvPills,
} from '../../composables/cv-pills';

const {
    prepareLevelPillsArray,
} = useCvPills();
</script>

<template>
    <div class="c-fooBar">
        <ul>
            <!--eslint-disable max-len-->
            <li
                v-for="bar in prepareLevelPillsArray([{ id: 23, label: 'Foo', level: { id: 10, title: 'Bar' } }, { id: 24, name: 'Foo', level: { id: 11, label: 'Bar' } }, { id: 25, label: 'Foo', level: { id: 12, label: 'Bar' } },] , 5)"
                :key="bar.id"
            >
                {{ bar.id }}
            </li>
        </ul>
    </div>
</template>
