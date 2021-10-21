<template>
  <div class='box intro-y p-5 mt-5'>
    <div id='tabulator' ref='tableRef' class='mt-5 table-report table-report--tabulator'></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Tabulator from 'tabulator-tables'
import feather from 'feather-icons'
import { useRouter } from 'vue-router'
import { appAxios } from '@/plugins/axios'

export default {
  setup() {
    const companies = ref([])
    const tableRef = ref()
    const tabulator = ref()
    const router = useRouter();

    const initTabulator = (data) => {
      console.log('data = ', data)
      
      tabulator.value = new Tabulator(tableRef.value, {
        data: data,
        pagination: 'local',
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 30, 40],
        layout: 'fitColumns',
        responsiveLayout: 'collapse',
        placeholder: 'No matching records found',
        columns: [
          {
            title: 'Display Name.',
            field: 'companyDisplayName',
            minWidth: 250,
            resizable: false,
          },
          // {
          //   title: 'Legal Name',
          //   field: 'companyLegalName',
          //   headerHozAlign: 'center',
          //   hozAlign: 'center',
          //   resizable: true,
          // },
          {
            title: 'Reg No',
            field: 'registrationNo',
            maxWidth: 120,
            headerHozAlign: 'center',
            hozAlign: 'center',
            resizable: true,
          }, {
            title: 'Taxt No',
            field: 'taxNumber',
            maxWidth: 120,
            hozAlign: 'center',
            resizable: true,
            headerSort: true,
          }, {
            title: 'Address',
            field: 'addressLine1',
            hozAlign: 'center',
            resizable: true,
            headerSort: true
          }, {
            title: 'City',
            field: 'city',
            hozAlign: 'center',
            headerHozAlign: 'center',
            resizable: true,
          }, {
            title: 'Country',
            field: 'country',
            hozAlign: 'center',
            resizable: true,
          }, {
            title: 'Phone',
            field: 'phone',
            hozAlign: 'center',
            headerHozAlign: 'center',
            resizable: true,
          }, {
            title: 'Email',
            field: 'primaryEmail',
            hozAlign: 'center',
            headerHozAlign: 'center',
            resizable: true,
          }, {
            title: 'ACTIONS',
            maxWidth: 130,
            responsive: 1,
            headerHozAlign: 'center',
            hozAlign: 'center',
            vertAlign: 'middle',
            headerSort: false,
            formatter(cell) {
              const a = cash(`<div class='flex lg:justify-center items-center'>
                <a class='flex items-center btn btn-sm btn-primary' href='javascript:;'>
                  View
                </a>
              </div>`)
              cash(a).on('click', function() {
                router.push({name: 'company-detail', params: {'companyId': cell.getData().companyId}})
              })
              return a[0]
            }
          },
        ],
        renderComplete() {
          feather.replace({
            'stroke-width': 1.5
          })
        }
      })
    }

    // Redraw table onresize
    const reInitOnResizeWindow = () => {
      window.addEventListener('resize', () => {
        tabulator.value.redraw()
        feather.replace({
          'stroke-width': 1.5
        })
      })
    }

    const init = async () => {
      const api = '/company/v1'
      companies.value = await appAxios.get(api).then(res => res.data)
      initTabulator(companies.value)
    }

    onMounted(() => {
      init()
      reInitOnResizeWindow()
    })

    return {
      companies,
      tableRef
    }
  },
}
</script>