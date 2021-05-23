<template>
	<el-dialog
		v-el-drag-dialog
		title="二维码解析规则说明"
		:width="width"
		top="50px"
		modal-append-to-body
		@close="close"
		:visible="dialogVisible"
		class="qrcode-rule-dialog"
		center
	>
		<el-tabs v-model="currentRule">
			<el-tab-pane label="方案一" name="1001">
				<h4>示例：</h4>
				<p>
					42819658^马瑛^37岁^女^1.肾虚血瘀,2.痛经^O19061037186^2019-06-10
					15:22^肝炎门诊^徐慧媛^自煎^JFO-煎服^14^150ml^0^医保^!!2111019001^30^克^包煎
				</p>
				<el-divider></el-divider>
				<h4>解析：</h4>
				<p>
					第一部分与第二部分的分割使用
					<span class="txt-red fbold">!!</span>
					符号进行分割，每个字段用<span class="txt-red fbold">
						^
					</span>
					符号进行分割
				</p>
				<h6>
					第一部分：<span class="split-info">（以 ^ 为分割）</span>
				</h6>
				<p>
					病历号^姓名^年龄^性别^临床诊断^处方号^收费时间^科室^医师^工艺^用法用量^付数^剂量^代煎付数^医保^!!
				</p>
				<h6>
					第二部分：<span class="split-info">（以 ^ 为分割）</span>
				</h6>
				<p>
					商品编号1^数量^单位^说明^商品编号2^数量^单位^说明^商品编号3^数量^单位^说明^商品编号4^数量^单位^说明^
				</p>
			</el-tab-pane>
			<el-tab-pane label="方案二" name="1002">
				<h4>示例：</h4>
				<p>
					FSZYY&12248|柳柳|30|女|中医科|王大夫|7|日一剂,水煎内服,分两次用|感冒|浓煎|1&1|601029|白芍|10|克|后下,2|601031|生白术|10|克|先煎
				</p>
				<el-divider></el-divider>
				<h4>解析：</h4>
				<p>
					<span class="txt-red fbold">&</span
					>作为分隔符，第一部分：处方信息主数据，第二部分为明细药品信息
				</p>
				<h6>
					第一部分：<span class="split-info">（以 | 为分割）</span>
				</h6>
				<p>
					处方号|患者姓名|年龄|性别|科室|医师|付数|服法用量|临床诊断|处方备注|医保类型
				</p>
				<h6>
					第二部分：<span class="split-info">（以 | 为分割）</span>
				</h6>
				<p>
					序号|编码|药品名称|数量|单位|药品脚注（或说明）
				</p></el-tab-pane
			>
			<el-tab-pane label="方案三" name="1003">
				<h4>示例：</h4>
				<p>
					FSZYY&12248|柳柳|30|女|中医科|王大夫|7|日一剂,水煎内服,分两次用|感冒|浓煎|1|A区|201|210126001&1|601029|白芍|10|克|后下|0.222,2|601031|生白术|10|克|先煎|0.3333
				</p>
				<el-divider></el-divider>
				<h4>解析：</h4>
				<p>
					<span class="txt-red fbold">&</span
					>作为分隔符，第一部分：处方信息主数据，第二部分为明细药品信息
				</p>
				<h6>
					第一部分：<span class="split-info">（以 | 为分割）</span>
				</h6>
				<p>
					处方号|患者姓名|年龄|性别|科室|医师|付数|服法用量|临床诊断|处方备注|医保类型|病区|床号|病历号(或患者id)
				</p>
				<h6>
					第二部分：<span class="split-info">（以 | 为分割）</span>
				</h6>
				<p>
					序号|编码|药品名称|数量|单位|药品脚注（或说明）|单价
				</p></el-tab-pane
			>
		</el-tabs>
		<div slot="footer" class="dialog-footer">
			<el-button plain @click="close">关闭</el-button>
		</div>
	</el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog';
export default {
    name: 'QrcodeRuleTips',
    directives: { elDragDialog },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            screenWidth: 0,
            width: this.initWidth(),
            switch: false,
            currentRule: '1001'
        };
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    watch: {
        switch() {
            this.$emit('update:dialogVisible', false);
        }
    },
    methods: {
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '50%';
            } else {
                return '800px';
            }
        },
        close() {
            this.currentRule = '1001';
            this.switch = !this.switch;
        }
    }
};
</script>
<style lang="scss" scoped>
.qrcode-rule-dialog {
	h4,
	h6 {
		margin: 0;
	}
	p {
		margin-top: 5px;
	}
	.txt-red {
		color: orangered;
	}
	.split-info {
		font-weight: normal;
	}
}
</style>
