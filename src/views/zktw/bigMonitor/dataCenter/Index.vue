<template>
    <div id="bigScreen">
        <dv-loading v-if="fullLoading"></dv-loading>
        <dv-full-screen-container>
            <div class="header">
                <div class="bg-header">
                    <div class="header_nav t-title">数据中心</div>
                </div>
            </div>
            <div class="screen-container">
                <div class="top-tie-wrap">
                    <div class="left-techonlogy">
                        <line-box title="工艺占比" />
                        <div class="echartBox">
                            <no-data
                                type="echartData"
                                v-if="techonlogyEchartNodata"
                            ></no-data>
                            <div
                                v-if="!techonlogyEchartNodata"
                                id="techonlogy-chart"
                                ref="techonlogy-chart"
                                :style="{
                                    width: '100%',
                                    height: '90%',
                                    margin: '0 auto',
                                }"
                            ></div>
                        </div>
                    </div>
                    <div class="center-pregrid">
                        <line-box title="处方分布" />
                        <div
                            class="echartBox"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="加载中"
                            element-loading-background="rgba(3, 13, 32, 1)"
                        >
                            <no-data
                                type="echartData"
                                v-if="prescripteGridNoData"
                            ></no-data>
                            <div
                                ref="prescripte-grid-chart"
                                v-if="!prescripteGridNoData"
                                id="prescripte-grid-chart"
                                :style="{
                                    width: '100%',
                                    height: '90%',
                                    margin: '0 auto',
                                }"
                            ></div>
                        </div>
                    </div>
                    <div class="right-pretable">
                        <line-box title="处方明细" />
                        <div class="table-content">
                            <dv-scroll-board
                                :config="tableConfig"
                                ref="scrollBoard"
                            />
                            <el-table
                                v-if="false"
                                :data="prescripteTableListData"
                                :max-height="tableHeight"
                                ref="detailTable"
                                style="
                                    width: 100%;
                                    border: none;
                                    border-radius: 5px;
                                "
                                border
                                element-loading-spinner="el-icon-loading"
                                element-loading-text="加载中"
                                element-loading-background="rgba(34, 40, 45, 0.8)"
                            >
                                <template slot="empty">
                                    <span>暂无数据</span>
                                </template>
                                <el-table-column
                                    prop="orgName"
                                    label="医院"
                                    align="center"
                                    min-width="110"
                                ></el-table-column>
                                <el-table-column
                                    prop="patientName"
                                    label="患者"
                                    align="center"
                                    min-width="60"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="technologyName"
                                    label="工艺"
                                    align="center"
                                    min-width="60"
                                ></el-table-column>
                                <el-table-column
                                    prop="doseNum"
                                    label="付数"
                                    align="center"
                                    min-width="40"
                                ></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <div class="pretime-grid">
                    <line-box title="分时处方分布" />
                    <div class="pregrid-echart-wrap">
                        <no-data
                            type="echartData"
                            v-if="prescripteTimeGridEchartNodata"
                        ></no-data>
                        <div
                            v-if="!prescripteTimeGridEchartNodata"
                            id="prescripte-time-grid-chart"
                            ref="prescripte-time-grid-chart"
                            :style="{
                                width: '90%',
                                height: '96%',
                                margin: '0 auto',
                            }"
                        ></div>
                    </div>
                </div>
                <div class="premonth-grid">
                    <line-box title="30天处方量" />
                    <div class="pregrid-echart-wrap">
                        <no-data
                            type="echartData"
                            v-if="prescripteMonthGridEchartNodata"
                        ></no-data>
                        <div
                            v-if="!prescripteMonthGridEchartNodata"
                            id="prescripte-month-grid-chart"
                            ref="prescripte-month-grid-chart"
                            :style="{
                                width: '90%',
                                height: '98%',
                                margin: '0 auto',
                            }"
                        ></div>
                    </div>
                </div>
            </div>
        </dv-full-screen-container>
    </div>
</template>
<script>
import Vue from 'vue';
import LineBox from '@/components/LineBox/Index';
import NoData from '@/components/NoData/Index';
import resize from '@/components/Charts/mixins/resize';
import { debounce } from '@/utils';
import {
    fullScreenContainer,
    loading,
    scrollBoard
} from '@jiaminghi/data-view';
Vue.use(fullScreenContainer).use(scrollBoard).use(loading);
const preTime = [
    '08:00',
    '08:10',
    '08:20',
    '08:30',
    '08:40',
    '08:50',
    '09:00',
    '09:10',
    '09:20',
    '09:30',
    '09:40',
    '09:50',
    '10:00',
    '10:10',
    '10:20',
    '10:30',
    '10:40',
    '10:50',
    '11:00',
    '11:10',
    '11:20',
    '11:30',
    '11:40',
    '11:50',
    '12:00',
    '12:10',
    '12:20',
    '12:30',
    '12:40',
    '12:50',
    '13:00',
    '13:10',
    '13:20',
    '13:30',
    '13:40',
    '13:50',
    '14:00',
    '14:10',
    '14:20',
    '14:30',
    '14:40',
    '14:50',
    '15:00',
    '15:10',
    '15:20',
    '15:30',
    '15:40',
    '15:50',
    '16:00',
    '16:10',
    '16:20',
    '16:30',
    '16:40',
    '16:50',
    '17:00',
    '17:10',
    '17:20',
    '17:30',
    '17:40',
    '17:50',
    '18:00'
];
export default {
    components: {
        LineBox,
        NoData
    },
    mixins: [resize],
    data() {
        return {
            tableConfig: {
                header: ['医院', '患者', '工艺', '付数'],
                waitTime: 2500,
                headerBGC: 'rgba(174, 206, 255, 0.1)',
                oddRowBGC: 'rgba(101,210,255,.15)',
                data: [['', '', '', '']],
                hoverPause: false,
                index: true,
                columnWidth: [50, 120, 80, 65, 65],
                align: ['center', 'center', 'center', 'center', 'center']
            },
            fullLoading: true,
            tableHeight: 300,
            prescripteTableLoading: false,
            prescripteTableListData: [],
            techonlogyLoading: false,
            techonlogyEchartNodata: false,
            prescripteGridLoading: false,
            prescripteGridNoData: false,
            prescripteTimeGridLoading: false,
            prescripteTimeGridEchartNodata: false,
            allPreTimeData: [],
            curIndex: 0,
            maxIndex: 0,
            prescripteMonthGridLoading: false,
            prescripteMonthGridEchartNodata: false,
            techonlogyChart: null,
            prescripteGridChart: null,
            prescripteTimeGridChart: null,
            prescripteTimeMonthChart: null,
            oneMinuteTimeUpdate: null, //一分钟更新
            fiveSecTimeUpdate: null, //5s更新
            threeSecTimeUpdate: null //3s更新
        };
    },

    created() {
        this.initHeight();
    },

    mounted() {
        this.transform = document.body.clientWidth / 1280;
        this.getTechnologyRatio();
        this.getPrescriptionDistribution();
        this.getRealTimePrescriptionDetial();
        this.getTimeSharePrescriptionNum();
        this.getThirtyDayPrescriptionNum();
        this.oneMinuteTimeUpdate = setInterval(() => {
            this.getTechnologyRatio();
            this.getPrescriptionDistribution();
            this.getTimeSharePrescriptionNum();
            this.getThirtyDayPrescriptionNum();
        }, 60000);
        this.fiveSecTimeUpdate = setInterval(() => {
            this.getRealTimePrescriptionDetial();
            this.dealShowPre(this.curIndex);
        }, 5000);
        this.__resizeHandler = debounce(() => {
            if (this.techonlogyChart) {
                this.techonlogyChart.resize();
            }
            if (this.prescripteGridChart) {
                this.prescripteGridChart.resize();
            }
            if (this.prescripteTimeGridChart) {
                this.prescripteTimeGridChart.resize();
            }
            if (this.prescripteTimeMonthChart) {
                this.prescripteTimeMonthChart.resize();
            }
            this.initHeight();
        }, 100);
        window.addEventListener('resize', this.__resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.__resizeHandler);
        clearInterval(this.threeSecTimeUpdate);
        clearInterval(this.fiveSecTimeUpdate);
        clearInterval(this.oneMinuteTimeUpdate);
    },
    methods: {
        initHeight() {
            this.$nextTick(() => {
                setTimeout(() => {
                    let containerHeight = document.getElementsByClassName(
                        'table-content'
                    )[0].offsetHeight;
                    let tableHeight = containerHeight - 2;
                    if (tableHeight < 150) tableHeight = 150;
                    this.tableHeight = tableHeight;
                }, 100);
            });
        },
        //工艺占比
        getTechnologyRatio() {
            this.techonlogyLoading = true;
            this.techonlogyEchartNodata = false;
            this.$api
                .report_dataDriveStoreReport_getTechnologyRatio()
                .then((r) => {
                    let { result, code } = r.data;
                    this.fullLoading = false;
                    if (code == 200 && result.length) {
                        let seriesData = [];
                        result.forEach((item) => {
                            seriesData.push({
                                name: item.technologyName,
                                value: item.num
                            });
                        });
                        this.drawTechnology(seriesData);
                    } else {
                        this.techonlogyEchartNodata = true;
                    }
                    this.techonlogyLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.techonlogyLoading = false;
                    this.techonlogyEchartNodata = true;
                    this.fullLoading = false;
                });
        },
        drawTechnology(seriesData) {
            var legendData = ['代煎', '阿胶膏', '加工', '自煎', '装桶'];
            var colorList = [
                '#73DDFF',
                '#73ACFF',
                '#FDD56A',
                '#FDB36A',
                '#FD866A',
                '#9E87FF',
                '#58D5FF'
            ];
            this.techonlogyChart = echarts.init(
                document.getElementById('techonlogy-chart')
            );
            const option = {
                title: {
                    text: '工艺',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    borderWidth: 1,
                    padding: 5,
                    formatter: function (parms) {
                        var str =
                            parms.marker +
                            '' +
                            parms.data.name +
                            '</br>' +
                            '数量：' +
                            parms.data.value +
                            '</br>' +
                            '占比：' +
                            parms.percent +
                            '%';
                        return str;
                    }
                },
                legend: {
                    show: false,
                    type: 'scroll',
                    orient: 'vertical',
                    right: '0',
                    align: 'auto',
                    top: '55%',
                    textStyle: {
                        color: '#fff'
                    },
                    data: legendData
                },
                series: [
                    {
                        type: 'pie',
                        z: 3,
                        center: ['50%', '50%'],
                        radius: ['60%', '75%'],
                        clockwise: true,
                        avoidLabelOverlap: true,
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    return colorList[params.dataIndex];
                                }
                            }
                        },
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: '{a|{b}：{d}%}\n{hr|}',
                            rich: {}
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                length2: 6,
                                lineStyle: {
                                    width: 1
                                }
                            }
                        },
                        data: seriesData
                    }
                ]
            };
            this.techonlogyChart.setOption(option);
        },
        //处方分布
        getPrescriptionDistribution() {
            this.prescripteGridLoading = true;
            this.prescripteGridNoData = false;
            this.$api
                .report_dataDriveStoreReport_getPrescriptionDistribution()
                .then((r) => {
                    let { result, code } = r.data;
                    this.fullLoading = false;
                    if (code == 200 && result) {
                        let disMap = {
                            待审核: 'pendingAudit',
                            待调剂: 'pendingAdjust',
                            调剂中: 'adjustIng',
                            待复核: 'pendingReCheck',
                            待包装: 'pendingPackWeigh',
                            待煎药: 'pendingDecoct',
                            煎药中: 'decoctIng',
                            待加工: 'pendingProcess',
                            加工中: 'processIng',
                            送货中: 'sendIng'
                        };
                        let xType = Object.keys(disMap);
                        let yData = [];
                        Object.values(disMap).forEach((item) => {
                            yData.push(result[item] || 0);
                        });
                        this.drawPrescripteGrid(xType, yData);
                    } else {
                        this.prescripteGridNoData = true;
                    }
                    this.prescripteGridLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.prescripteGridLoading = false;
                    this.prescripteGridNoData = true;
                    this.fullLoading = false;
                });
        },
        drawPrescripteGrid(xType, yData) {
            this.prescripteGridChart = echarts.init(
                document.getElementById('prescripte-grid-chart')
            );
            const option = {
                color: ['#63caff', '#3608FE'],
                grid: {
                    containLabel: true,
                    left: 20,
                    right: 20,
                    bottom: 10,
                    top: 40
                },
                xAxis: {
                    axisLabel: {
                        color: '#e7f5fb',
                        fontSize: 10 * this.transform
                    },
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#384267',
                            width: 1,
                            type: 'dashed'
                        },
                        show: true
                    },
                    data: xType,
                    type: 'category'
                },
                yAxis: {
                    axisLabel: {
                        color: '#e7f5fb',
                        fontSize: 12
                    },

                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#384267',
                            type: 'dashed'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#384267',
                            width: 1,
                            type: 'dashed'
                        },
                        show: true
                    },
                    name: ''
                },
                series: [
                    {
                        data: yData,
                        type: 'bar',
                        itemStyle: {
                            color: {
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                type: 'linear',
                                global: false,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#3A1BFD'
                                    },
                                    {
                                        offset: 1,
                                        color: '#3BEFFD'
                                    }
                                ]
                            }
                        },
                        label: {
                            show: true,
                            position: 'top',
                            distance: 10,
                            color: '#fff'
                        }
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    show: true
                }
            };
            this.prescripteGridChart.setOption(option);
        },

        //处方明细
        getRealTimePrescriptionDetial() {
            this.prescripteTableLoading = true;
            this.$api
                .report_dataDriveStoreReport_getRealTimePrescriptionDetial()
                .then((r) => {
                    let { result } = r.data;
                    this.dealPrescriptionDetial(result);
                    this.prescripteTableLoading = false;
                    this.fullLoading = false;
                    // this.$nextTick(() => {
                    //     this.$refs.detailTable.bodyWrapper.scrollTop = this.$refs.detailTable.bodyWrapper.scrollHeight;
                    // });
                })
                .catch((err) => {
                    console.log(err);
                    this.prescripteTableLoading = false;
                    this.fullLoading = false;
                });
        },
        //处理处方明细数据
        dealPrescriptionDetial(result) {
            let listArr = [];
            result.forEach((item, index) => {
                listArr.push([]);
                Object.keys(item).forEach((key) => {
                    listArr[index].push(item[key]);
                });
            });
            this.$refs['scrollBoard'].updateRows(listArr);
        },
        //分时处方量
        getTimeSharePrescriptionNum() {
            this.prescripteTimeGridLoading = true;
            this.prescripteTimeGridEchartNodata = false;
            this.$api
                .report_dataDriveStoreReport_getTimeSharePrescriptionNum()
                .then((r) => {
                    let { result, code } = r.data;
                    this.fullLoading = false;

                    if (code == 200) {
                        this.allPreTimeData = result.filter(
                            (item) => item.timeSharePrescriptionNumBoList.length
                        );
                        this.maxIndex = Math.ceil(
                            this.allPreTimeData.length / 5
                        );
                        this.curIndex = 0;
                        this.dealShowPre(this.curIndex, 'api');
                    } else {
                        this.prescripteTimeGridEchartNodata = true;
                    }
                    this.prescripteTimeGridLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.prescripteTimeGridLoading = false;
                    this.prescripteTimeGridEchartNodata = true;
                    this.fullLoading = false;
                });
        },
        //展示机构
        dealShowPre(curIndex, from) {
            if (curIndex >= this.maxIndex && !from) {
                this.getTimeSharePrescriptionNum();
                return;
            }
            let data = this.allPreTimeData.slice(
                curIndex * 5,
                curIndex * 5 + 5
            );
            data.forEach((item) => {
                item.timeObj = {};
                item.timeSharePrescriptionNumBoList.forEach((_v) => {
                    item.timeObj[_v.time] = _v.num;
                });
            });
            this.drawPrescripteTimeGrid(data);
            this.curIndex++;
        },
        //时间补0
        timeAddZero(timeObj) {
            let yData = [];
            preTime.forEach((time) => {
                if (timeObj[time]) {
                    yData.push(Number(timeObj[time]));
                } else {
                    yData.push(0);
                }
            });
            return yData;
        },
        drawPrescripteTimeGrid(data) {
            let colorArr = [
                '#a52c6b',
                '#e8ac07',
                '#a812f6',
                '#07d9a2',
                '#0e8be3'
            ];
            let legendArr = [];
            let seriesData = [];
            data.forEach((v, index) => {
                legendArr.push(v.orgName);
                seriesData.push({
                    name: v.orgName,
                    type: 'line',
                    // smooth: true,
                    symbol: 'circle',
                    symbolSize: 2,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 2,
                            color: colorArr[index]
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: colorArr[index],
                            borderColor: colorArr[index],
                            borderWidth: 0
                        }
                    },

                    data: this.timeAddZero(v.timeObj)
                });
            });
            this.prescripteTimeGridChart = echarts.init(
                document.getElementById('prescripte-time-grid-chart')
            );
            const option = {
                title: [
                    {
                        textAlign: 'center',
                        textStyle: {
                            color: '#0fc2e7',
                            fontSize: 14,
                            lineHeight: 12
                        },
                        right: '30%',
                        top: '0%'
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    icon: 'roundRect',
                    itemWidth: 25,
                    itemHeight: 2,
                    data: legendArr,
                    textStyle: {
                        fontSize: 14, //字体大小
                        color: '#f5feff' //字体颜色
                    },
                    right: 'center', //距离右侧
                    top: '12%'
                },
                grid: {
                    left: '4%',
                    top: '60px',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#14568d'
                            }
                        },
                        axisLabel: {
                            // interval: 0, //设置x轴的标签显示可自适应
                            show: true,
                            textStyle: {
                                color: '#e7f5fb'
                            }
                        },
                        data: preTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        nameTextStyle: {
                            //y轴上方单位的颜色
                            color: '#e7f5fb'
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true, //y轴线
                            lineStyle: {
                                color: '#14568d'
                            }
                        },
                        axisLabel: {
                            // margin: 10,
                            textStyle: {
                                fontSize: 12,
                                color: '#e7f5fb'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: ['#56859d'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    }
                ],
                series: seriesData
            };
            this.prescripteTimeGridChart.setOption(option);
        },
        //30日处方量
        getThirtyDayPrescriptionNum() {
            this.prescripteMonthGridLoading = true;
            this.prescripteMonthGridEchartNodata = false;
            this.$api
                .report_dataDriveStoreReport_getThirtyDayPrescriptionNum()
                .then((r) => {
                    let { result, code } = r.data;
                    this.fullLoading = false;

                    if (code == 200) {
                        let xTime = [];
                        let yData = [];
                        result.forEach((item) => {
                            xTime.push(item.date);
                            yData.push(item.num);
                        });
                        this.drawPrescripteMonthGrid(xTime, yData);
                    } else {
                        this.prescripteMonthGridEchartNodata = true;
                    }
                    this.prescripteMonthGridLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.prescripteMonthGridLoading = false;
                    this.prescripteMonthGridEchartNodata = true;
                    this.fullLoading = false;
                });
        },
        drawPrescripteMonthGrid(xTime, yData) {
            this.prescripteTimeMonthChart = echarts.init(
                document.getElementById('prescripte-month-grid-chart')
            );
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(255,255,255,0)' // 0% 处的颜色
                                    },
                                    {
                                        offset: 0.5,
                                        color: 'rgba(255,255,255,1)' // 100% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(255,255,255,0)' // 100% 处的颜色
                                    }
                                ],
                                global: false // 缺省为 false
                            }
                        }
                    }
                },
                legend: {
                    icon: 'roundRect',
                    itemWidth: 25,
                    itemHeight: 2,
                    textStyle: {
                        fontSize: 14, //字体大小
                        color: '#f5feff' //字体颜色
                    },
                    right: 'center', //距离右侧
                    top: '12%'
                },
                grid: {
                    left: '4%',
                    top: '60px',
                    right: '4%',
                    bottom: '4%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        axisLine: {
                            //坐标轴轴线相关设置。数学上的x轴
                            show: true,
                            lineStyle: {
                                color: 'color:"#092b5d"'
                            }
                        },
                        axisLabel: {
                            //坐标轴刻度标签的相关设置
                            textStyle: {
                                color: '#fff',
                                margin: 15
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        data: xTime
                    }
                ],
                yAxis: [
                    {
                        min: 0,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#092b5d'
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#092b5d'
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            },
                            formatter: function (value) {
                                if (value === 0) {
                                    return value;
                                }
                                return value;
                            }
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '处方量',
                        type: 'line',
                        symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
                        showAllSymbol: true,
                        symbolSize: 3,
                        lineStyle: {
                            normal: {
                                color: '#7c80f4' // 线条颜色
                            },
                            borderColor: 'rgba(0,0,0,.4)'
                        },
                        itemStyle: {
                            color: '#7c80f4',
                            borderColor: '#fff',
                            borderWidth: 1
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: [' {a|{c}}'].join(','),
                                rich: {
                                    a: {
                                        color: '#fff',
                                        align: 'center'
                                    }
                                }
                            }
                        },
                        tooltip: {
                            show: true
                        },
                        areaStyle: {
                            //区域填充样式
                            normal: {
                                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: 'rgba(124, 128, 244,.3)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(124, 128, 244, 0)'
                                        }
                                    ],
                                    false
                                ),
                                shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                                shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                            }
                        },
                        data: yData
                    }
                ]
            };
            this.prescripteTimeMonthChart.setOption(option);
        }
    }
};
</script>
<style lang="scss" scoped>
.right-pretable /deep/ .el-table td,
.el-table th {
    padding: 4px 0 !important;
}
.right-pretable /deep/.el-table th,
.el-table td {
    padding: 2px 0 !important;
}
.right-pretable /deep/ .el-table .cell {
    padding-left: 4px !important;
    padding-right: 4px !important;
    font-size: 0.75rem !important;
}
.right-pretable /deep/ .el-table,
.el-table__expanded-cell {
    background: none !important;
}
.right-pretable /deep/ .el-table thead tr {
    background: rgba(174, 206, 255, 0.1) !important;
}
.right-pretable /deep/ .el-table thead {
    color: #fff !important;
}
.right-pretable /deep/ .el-table {
    color: #fff !important;
}
.right-pretable /deep/ .el-table thead tr {
    background: rgba(174, 206, 255, 0.1) !important;
}
.right-pretable /deep/ .el-table__body-wrapper tr {
    background: transparent !important;
}
.right-pretable /deep/ .el-table th,
.el-table tr {
    background: rgb(50, 66, 89) !important;
}
.right-pretable /deep/ .el-table--border:after,
.right-pretable /deep/.el-table--group:after,
.el-table:before {
    background-color: rgba(174, 206, 255, 0.1) !important;
}
.right-pretable /deep/ .el-form-item {
    margin-bottom: 0 !important;
}
.right-pretable /deep/.el-table th.is-leaf,
.el-table td {
    border: 1px solid rgba(120, 124, 128, 0.57) !important;
}
.right-pretable /deep/ .el-table td.is-center,
.el-table th.is-center {
    border: 1px solid rgba(120, 124, 128, 0.57) !important;
}
.right-pretable
    /deep/
    .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td {
    background: rgba(101, 210, 255, 0.15) !important;
}
.right-pretable /deep/.el-input__inner,
.el-table th,
.el-table tr,
.el-textarea__inner {
    background: rgba(174, 206, 255, 0.1) !important;
}

#bigScreen {
    width: 100%;
    height: 100%;
    // font-size: 0.75rem;
    background: url("../../../../assets/bigScreenBg.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    //滚动条的宽度
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 0px !important;
        height: 5px !important;
        border-radius: 50% !important;
    }
    //滚动条的滑块
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        background-color: rgba(101, 210, 255, 0.15) !important;
        border-radius: 3px !important;
    }
    /deep/ .gutter {
        width: 0px !important;
        display: none !important;
    }
    // /deep/ #dv-full-screen-container{
    //     width: 1280px  !important;
    //     height:   720px  !important;
    // }
    /deep/ .dv-scroll-board {
        .header {
            font-size: 0.8125rem;
        }
        .rows {
            .ceil {
                padding: 0;
            }
            .row-item {
                font-size: 0.75rem;
            }
        }
    }

    .dv-loading {
        background: #0c1a2c;
        position: absolute;
        z-index: 99999;
    }
    .header {
        width: 100%;
        height: 3.125rem;
        min-width: 960px;
        .bg-header {
            width: 100%;
            height: 3.125rem;
            background: url("../../../../assets/bigScreenHead.png") no-repeat;
            background-size: 100% 100%;
            .t-title {
                width: 100%;
                height: 100%;
                text-align: center;
                font-size: 1.3rem;
                line-height: 3.125rem;
                color: #fff;
            }
        }
    }
    .screen-container {
        height: calc(100% - 2.8125rem);
        display: flex;
        flex-direction: column;
        // justify-content: space-around;
        margin-top: 0.625rem;
        align-items: center;
        /deep/ .empty {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .image {
                height: 60%;
            }
        }
        .pretime-grid,
        .premonth-grid {
            height: 32%;
            width: 99%;
            box-sizing: border-box;
            border: 1px solid #2c58a6;
            position: relative;
            box-shadow: 0 0 0.625rem #2c58a6;

            .pregrid-echart-wrap {
                display: flex;
                height: 100%;
                justify-content: space-around;
            }
        }

        .top-tie-wrap {
            height: 32%;
            width: 99%;
            display: flex;
            justify-content: space-between;
            .left-techonlogy,
            .center-pregrid,
            .right-pretable {
                width: 30%;
                height: 100%;
                box-sizing: border-box;
                border: 1px solid #2c58a6;
                position: relative;
                box-shadow: 0 0 0.625rem #2c58a6;

                .echartBox {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }

                .table-content {
                    overflow: hidden;
                    margin-top: 0.9375rem;
                    height: calc(100% - 0.9375rem);
                    // padding-left: 17px;
                    width: 100%;
                }
            }
            .center-pregrid {
                width: 40%;
            }
        }
    }
}
</style>
