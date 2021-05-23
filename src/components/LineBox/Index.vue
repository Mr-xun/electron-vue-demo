<template>
    <div class="line-content">
        <div class="t-line-box">
            <i class="t-l-line"></i>
            <i class="l-t-line"></i>
        </div>
        <div class="t-line-box">
            <i class="t-r-line"></i>
            <i class="r-t-line"></i>
        </div>
        <div class="t-line-box">
            <i class="l-b-line"></i>
            <i class="b-l-line"></i>
        </div>
        <div class="t-line-box">
            <i class="r-b-line"></i>
            <i class="b-r-line"></i>
        </div>
        <div class="main-title">{{title}}</div>
    </div>
</template>
<script>
export default {
    props: {
        title: {//标题
            type: String,
            default: ' '
        }
    },
    mounted() { }
};
</script>
<style lang="scss" scoped>
.line-content {
    .t-line-box {
        position: absolute;
        width: 100%;
        height: 100%;

        i {
            background-color: #4788fb;
            box-shadow: 0px 0px 10px #4788fb;
            position: absolute;
        }

        .t-l-line {
            height: 5px;
            width: 26px;
            left: -3px;
            top: -3px;
        }

        .l-t-line {
            width: 5px;
            height: 24px;
            left: -3px;
            top: -3px;
        }

        .t-r-line {
            height: 5px;
            width: 26px;
            right: -3px;
            top: -3px;
        }

        .r-t-line {
            width: 5px;
            height: 24px;
            right: -3px;
            top: -3px;
        }

        .l-b-line {
            width: 5px;
            height: 24px;
            left: -3px;
            bottom: -3px;
        }

        .b-l-line {
            height: 5px;
            width: 26px;
            left: -3px;
            bottom: -3px;
        }
        .r-b-line {
            width: 5px;
            height: 24px;
            right: -3px;
            bottom: -3px;
        }

        .b-r-line {
            height: 5px;
            width: 26px;
            right: -3px;
            bottom: -3px;
        }
    }
    .main-title {
        width: 11.25rem;
        height: 1.75rem;
        line-height: 1.625rem;
        background-color: #2c58a6;
        border-radius: 10px;
        position: absolute;
        top: -17px;
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #fff;
        font-size: 0.875rem;
        font-weight: 600;
        box-sizing: border-box;
        z-index: 9000;
        text-align: center;
    }
}
</style>