<template>
  <div>
		<div class='font-medium text-2xl'>Holidays</div>
    <div class="grid grid-cols-12 gap-5 mt-5">
      <!-- BEGIN: Calendar Content -->
      <div class="col-span-12 xl:col-span-8 xxl:col-span-9">
        <div class="box p-5">
          <Calendar />
        </div>
      </div>
      <!-- END: Calendar Content -->
      <!-- BEGIN: Calendar Side Menu -->
      <div class="col-span-12 xl:col-span-4 xxl:col-span-3">
        <div class="box p-5 intro-y">
          <button type="button" class="btn btn-primary w-full mt-2" @click="openAddLockDaysModal">
            <Edit3Icon class="w-4 h-4 mr-2" /> Add New LockDays
          </button>
          <FullCalendarDraggable
            id="calendar-events"
            :options="dragableOptions"
            class="border-t border-b border-gray-200 dark:border-dark-5 mt-6 mb-5 py-3"
          >
            <div v-for='(lockDay, index) in sampleLockDays' :key = 'index' class="relative">
              <div
                class="event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-1 rounded-md flex items-center"
              >
                <div class="w-2 h-2 bg-theme-11 rounded-full mr-3"></div>
                <div class="pr-10">
                  <div class="event__title truncate">{{lockDay.title}}</div>
                  <div class="text-gray-600 text-xs mt-0.5">
                    <span class="event__days">{{lockDay.noOfDays}}</span> Days
                    <span class="mx-1">•</span> {{lockDay.time}}
                  </div>
                </div>
              </div>
              <a class="flex items-center absolute top-0 bottom-0 my-auto right-0" @click="openAddLockDaysModal">
                <EditIcon class="w-4 h-4 text-gray-600" />
              </a>
            </div>
            <div id="calendar-no-events" class="text-gray-600 p-3 text-center hidden">
              No events yet
            </div>
          </FullCalendarDraggable>
          <div class="form-check">
            <label class="form-check-label" for="checkbox-events">Remove after drop</label>
            <input
              id="checkbox-events"
              class="show-code form-check-switch ml-auto"
              type="checkbox"
            />
          </div>
        </div>
      </div>
      <!-- END: Calendar Side Menu -->
    </div>
  </div>
  <!-- BEGIN: Add new Lock day Modal Content -->
    <div id='add-new-lock-days-modal' class='modal' tabindex='-1' aria-hidden='true'>
     <div class='modal-dialog modal-lg'>
        <div class='modal-content'>
          <!-- BEGIN: Modal Header -->
          <div class='modal-header'>
            <h2 class='font-medium text-base mr-auto'> New Lock Days </h2>
          </div> <!-- END: Modal Header -->
          <div class='m-8'>
            <div class="grid gap-y-3">
              <label for='lock-day-title'>title</label>
              <input id='lock-day-title' type='text' v-model="newLockDay.title" class="form-control" placeholder="please add your lock days title"/>
              <div class="flex gap-x-4">
                <div class="w-full">
                  <label for='lock-day-no-of-days'>Number of Days</label>
                  <input id='lock-day-no-of-days' v-model="newLockDay.noOfDays" type='number' class="form-control" />
                </div>
                <div class="w-full">
                  <label for='lock-day-time'>Time</label>
                  <input id='lock-day-time' v-model="newLockDay.time" type='text' class="form-control" placeholder="7:00 AM"/>
                </div>
              </div>
            </div>
          </div>
          <div class='modal-footer text-right'>
            <button
              type='button'
              @click='addLockDays'
              class='btn bg-red-400 w-full text-white'
              :disabled="!newLockDay.title.length || !newLockDay.noOfDays || !newLockDay.time.length" > Add </button>
          </div> <!-- END: Modal Footer   -->
        </div>
      </div>
    </div>
     <!--END: Add New Lock Day Modal Content -->
</template>

<script>
import { ref } from 'vue'
import Calendar from "@/components/calendar/Main.vue"

export default {
  components: {
    Calendar
  },
  setup() {
    const sampleLockDays = ref([{
        title: 'Mary Crismas',
        noOfDays: 5,
        time: '10:00 AM'
      }, {
        title: 'Happy New Year',
        noOfDays: 7,
        time: '7:00 AM'
      }
    ])
    const newLockDay = ref({
      title: '',
      noOfDays: 1,
      time: ''
    })
    const openAddLockDaysModal = () => {
      cash('#add-new-lock-days-modal').modal('show')
    }
    const addLockDays = () => {
      sampleLockDays.value.push(newLockDay.value)
      cash('#add-new-lock-days-modal').modal('hide')
      newLockDay.value = {title: '', noOfDays: 1, time: ''}
    }
    const dragableOptions = {
      itemSelector: ".event",
      eventData(eventEl) {
        return {
          title: cash(eventEl).find(".event__title").html(),
          duration: {
            days: parseInt(
              cash(eventEl).find(".event__days").text()
            )
          }
        };
      }
    }

    return {
      dragableOptions,
      sampleLockDays,
      newLockDay,
      addLockDays,
      openAddLockDaysModal
    }
  }
}
</script>
