<template>
	<div class="container prescribe-enter-container">
		<res-split-pane
			split-to="columns"
			@update:size="paneResize"
			:allow-resize="true"
			:size="paneWidth"
			:min-size="220"
		>
			<div slot="firstPane" class="lt-container">
				<div class="control-btn" @click="recordToggle">
					<i
						:class="
							showRecord
								? 'el-icon-d-arrow-left'
								: 'el-icon-d-arrow-right'
						"
					></i>
				</div>
				<prescripte-record
					ref="prescripteRecord"
					v-show="showRecord"
					@chooseOrder="chooseOrder"
				/>
			</div>
			<div slot="secondPane" class="right-container">
				<div class="insert-container">
					<div class="history-title">
						<h6>处方操作区域</h6>
						<span>流水号：{{ orderForm.orderNo || "---" }}</span>
						<span
							>状态：{{
								orderForm.orderStatus | flOrderStatusName
							}}</span
						>
					</div>
					<div class="mainForm-wrapper">
						<el-form
							ref="orderForm"
							:model="orderForm"
							:inline="true"
							:rules="rules"
							class="custom-form"
							label-width="85px"
						>
							<el-form-item
								label=" "
								label-width="20px"
								class="opt-groud"
							>
								<el-button
									class="opt-btn"
									type="primary"
									size="mini"
									@click="create"
									>新建</el-button
								>
								<el-button
									class="opt-btn repeal-btn"
									type="info"
									size="mini"
									@click="backOut"
									:disabled="
										!orderForm.orderStatus ||
										orderForm.orderStatus > 10
									"
									>撤销</el-button
								>
								<el-button
									class="opt-btn edit-btn"
									type="info"
									size="mini"
									@click="modify"
									:disabled="
										!orderForm.orderStatus ||
										orderForm.orderStatus > 10
									"
									>修改</el-button
								>
								<el-button
									class="opt-btn copy-btn"
									type="info"
									size="mini"
									:disabled="!orderForm.orderStatus"
									:loading="copyLoading"
									@click="copy"
									>复制</el-button
								>
								<el-button
									class="opt-btn code-btn"
									type="info"
									size="mini"
									@click="openScanCode"
									>扫码</el-button
								>
							</el-form-item>
							<el-form-item
								label="处方号"
								prop="prescriptionNumber"
							>
								<el-input
									size="mini"
									:style="{ width: itemWidth }"
									v-model="orderForm.prescriptionNumber"
									ref="prescriptionNumber"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'prescriptionNumber',
											'medicalRecordNumber',
											'处方号',
											orderForm.prescriptionNumber
										)
									"
									placeholder="处方号"
								></el-input>
							</el-form-item>
							<el-form-item label="患者编号">
								<el-input
									size="mini"
									ref="medicalRecordNumber"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'medicalRecordNumber',
											'patientName',
											'病历号/患者卡号',
											orderForm.medicalRecordNumber,
											false
										)
									"
									:style="{ width: itemWidth }"
									v-model="orderForm.medicalRecordNumber"
									placeholder="病历号/患者卡号"
								></el-input>
							</el-form-item>
							<el-form-item label="患者" prop="patientName">
								<el-input
									size="mini"
									ref="patientName"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'patientName',
											'sex',
											'患者',
											orderForm.patientName
										)
									"
									:style="{ width: itemWidth }"
									v-model="orderForm.patientName"
									placeholder="患者"
								></el-input>
							</el-form-item>
							<el-form-item label="性别" prop="sex">
								<el-select
									size="mini"
									ref="sex"
									:disabled="disabledEdit"
									@change="changeJump($event, 'sex', 'age')"
									:filter-method="filterSexOpts"
									:style="{ width: itemWidth }"
									v-model="orderForm.sex"
									clearable
									filterable
									default-first-option
									placeholder="请选择"
								>
									<el-option
										v-for="item in flSexOpts"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
										<span style="float: left">{{
											item.value
										}}</span>
										<span
											style="
												float: right;
												font-size: 13px;
											"
											>{{ item.label }}</span
										>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="年龄" prop="age">
								<el-input
									size="mini"
									ref="age"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'age',
											'departmentName',
											'年龄',
											orderForm.age
										)
									"
									:style="{ width: itemWidth }"
									v-model="orderForm.age"
									placeholder="年龄"
								></el-input>
							</el-form-item>
							<el-form-item label="科室" prop="departmentName">
								<el-autocomplete
									size="mini"
									ref="departmentName"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'departmentName',
											'physician',
											'科室',
											orderForm.departmentName,
											true,
											true
										)
									"
									v-model="orderForm.departmentName"
									:style="{ width: itemWidth }"
									:fetch-suggestions="
										departmentNameQuerySearch
									"
									placeholder="科室"
									highlight-first-item
									popper-class="form-select-panel"
									:popper-append-to-body="false"
								>
									<template slot-scope="{ item }">
										<div class="sel-cell wd80">
											{{ item.code }}
										</div>
										<div class="sel-cell wd80 fellip">
											{{ (item.value = item.name) }}
										</div>
										<div class="sel-cell wd80">
											{{ item.shorthandCode }}
										</div>
									</template>
								</el-autocomplete>
							</el-form-item>
							<el-form-item label="医师" prop="physician">
								<el-autocomplete
									size="mini"
									ref="physician"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'physician',
											'doseNum',
											'医师',
											orderForm.physician,
											true,
											true
										)
									"
									v-model="orderForm.physician"
									:style="{ width: itemWidth }"
									:fetch-suggestions="physicianQuerySearch"
									placeholder="医师"
									highlight-first-item
									popper-class="form-select-panel"
									:popper-append-to-body="false"
								>
									<template slot-scope="{ item }">
										<div class="sel-cell wd80">
											{{ item.code }}
										</div>
										<div class="sel-cell wd80 fellip">
											{{ (item.value = item.name) }}
										</div>
										<div class="sel-cell wd80">
											{{ item.shorthandCode }}
										</div>
									</template>
								</el-autocomplete>
							</el-form-item>
							<el-form-item label="付数" prop="doseNum">
								<el-input
									size="mini"
									ref="doseNum"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'doseNum',
											'dosage',
											'付数',
											orderForm.doseNum
										)
									"
									:style="{ width: itemWidth }"
									v-model.number="orderForm.doseNum"
									v-number-only
									placeholder="付数"
								></el-input>
							</el-form-item>
							<el-form-item label="用法用量" prop="dosage">
								<el-select
									size="mini"
									ref="dosage"
									:disabled="disabledEdit"
									@change="
										changeJump(
											$event,
											'dosage',
											'technologyId'
										)
									"
									:filter-method="filterDosageOpts"
									popper-class="form-select-panel"
									:popper-append-to-body="false"
									:style="{ width: itemWidth }"
									v-model="orderForm.dosage"
									clearable
									filterable
									autocomplete="on"
									default-first-option
									placeholder="请选择"
								>
									<el-option
										v-for="item in flDosageOpts"
										:label="item.name"
										:key="item.id"
										:value="item.name"
									>
										<div class="sel-cell wd80">
											{{ item.code }}
										</div>
										<div class="sel-cell wd160 fellip">
											{{ item.name }}
										</div>
										<div class="sel-cell wd80">
											{{ item.shorthandCode }}
										</div>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="工艺" prop="technologyId">
								<el-select
									size="mini"
									ref="technologyId"
									:disabled="disabledEdit"
									@change="
										changeJump(
											$event,
											'technologyId',
											'instantLevel',
											'enumId',
											'technologyName',
											'flCarftOpts'
										)
									"
									:filter-method="filterCarftOpts"
									popper-class="form-select-panel"
									:popper-append-to-body="false"
									:style="{ width: itemWidth }"
									v-model="orderForm.technologyId"
									clearable
									filterable
									autocomplete="on"
									default-first-option
									placeholder="请选择"
								>
									<el-option
										v-for="item in flCarftOpts"
										:label="item.name"
										:key="item.enumId"
										:value="Number(item.enumId)"
									>
										<div class="sel-cell wd60">
											{{ item.code }}
										</div>
										<div class="sel-cell wd60">
											{{ item.name }}
										</div>
										<div class="sel-cell wd60">
											{{ item.shorthandCode }}
										</div>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="紧急度" prop="instantLevel">
								<el-select
									size="mini"
									ref="instantLevel"
									:disabled="disabledEdit"
									@change="
										changeJump(
											$event,
											'instantLevel',
											'isWard'
										)
									"
									:filter-method="filterUrgentOpts"
									popper-class="form-select-panel"
									:popper-append-to-body="false"
									:style="{ width: itemWidth }"
									v-model="orderForm.instantLevel"
									clearable
									filterable
									autocomplete="on"
									default-first-option
									placeholder="请选择"
								>
									<el-option
										v-for="item in flUrgentOpts"
										:label="item.name"
										:key="item.enumId"
										:value="item.enumId"
									>
										<div class="sel-cell wd60">
											{{ item.code }}
										</div>
										<div class="sel-cell wd60">
											{{ item.name }}
										</div>
										<div class="sel-cell wd60">
											{{ item.shorthandCode }}
										</div>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="门诊/病房" prop="isWard">
								<el-select
									size="mini"
									ref="isWard"
									:disabled="disabledEdit"
									@change="
										changeJump($event, 'isWard', 'wardArea')
									"
									:filter-method="filterClincOrWardOpts"
									:style="{ width: itemWidth }"
									v-model="orderForm.isWard"
									clearable
									filterable
									default-first-option
									placeholder="请选择"
								>
									<el-option
										v-for="item in flClincOrWardOpts"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
										<span style="float: left">{{
											item.value
										}}</span>
										<span
											style="
												float: right;
												font-size: 13px;
											"
											>{{ item.label }}</span
										>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								label="病区"
								prop="wardArea"
								v-if="orderForm.isWard == 1"
							>
								<el-input
									size="mini"
									ref="wardArea"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'wardArea',
											'bedNumber',
											'病区',
											orderForm.wardArea
										)
									"
									:style="{ width: itemWidth }"
									v-model="orderForm.wardArea"
									placeholder="病区"
								></el-input>
							</el-form-item>
							<el-form-item
								label="床号"
								prop="bedNumber"
								v-if="orderForm.isWard == 1"
							>
								<el-input
									size="mini"
									ref="bedNumber"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'bedNumber',
											'diseaseSpecies',
											'床号',
											orderForm.bedNumber
										)
									"
									:style="{ width: itemWidth }"
									v-model="orderForm.bedNumber"
									placeholder="床号"
								></el-input>
							</el-form-item>
							<el-form-item label="临床诊断">
								<el-autocomplete
									size="mini"
									ref="diseaseSpecies"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'diseaseSpecies',
											'prescriptionRemarkName',
											'临床诊断',
											orderForm.diseaseSpecies,
											false,
											true
										)
									"
									v-model="orderForm.diseaseSpecies"
									:style="{ width: itemWidth }"
									:fetch-suggestions="
										diseaseSpeciesQuerySearch
									"
									placeholder="临床诊断"
									highlight-first-item
									popper-class="form-select-panel"
									:popper-append-to-body="false"
								>
									<template slot-scope="{ item }">
										<div class="sel-cell wd80">
											{{ item.code }}
										</div>
										<div class="sel-cell wd180 fellip">
											{{ (item.value = item.name) }}
										</div>
										<div class="sel-cell wd140">
											{{ item.shorthandCode }}
										</div>
									</template>
								</el-autocomplete>
							</el-form-item>
							<el-form-item label="处方备注">
								<el-autocomplete
									size="mini"
									ref="prescriptionRemarkName"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'prescriptionRemarkName',
											'isMedicalInsurance',
											'处方备注',
											orderForm.prescriptionRemarkName,
											false,
											true
										)
									"
									v-model="orderForm.prescriptionRemarkName"
									:style="{ width: itemWidth }"
									:fetch-suggestions="
										prescriptionRemarkQuerySearch
									"
									placeholder="处方备注"
									highlight-first-item
									popper-class="form-select-panel"
									:popper-append-to-body="false"
								>
									<template slot-scope="{ item }">
										<div class="sel-cell wd80">
											{{ item.code }}
										</div>
										<div class="sel-cell wd180 fellip">
											{{ (item.value = item.name) }}
										</div>
										<div class="sel-cell wd140">
											{{ item.shorthandCode }}
										</div>
									</template>
								</el-autocomplete>
							</el-form-item>
							<el-form-item
								label="医保"
								prop="isMedicalInsurance"
							>
								<el-select
									size="mini"
									ref="isMedicalInsurance"
									:disabled="disabledEdit"
									@change="
										changeJump(
											$event,
											'isMedicalInsurance',
											'isDeliveryToDoor'
										)
									"
									:filter-method="filterIsOrNoOpts"
									:style="{ width: itemWidth }"
									v-model="orderForm.isMedicalInsurance"
									default-first-option
									clearable
									filterable
									placeholder="请选择"
								>
									<el-option
										v-for="item in flIsOrNoOpts"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
										<span style="float: left">{{
											item.value
										}}</span>
										<span
											style="
												float: right;
												font-size: 13px;
											"
											>{{ item.label }}</span
										>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								label="送货上门"
								prop="isDeliveryToDoor"
							>
								<el-select
									size="mini"
									ref="isDeliveryToDoor"
									:disabled="disabledEdit"
									@change="
										changeJump(
											$event,
											'isDeliveryToDoor',
											'tel'
										)
									"
									:filter-method="filterIsOrNoOpts"
									:style="{ width: itemWidth }"
									v-model="orderForm.isDeliveryToDoor"
									default-first-option
									clearable
									filterable
									placeholder="请选择"
								>
									<el-option
										v-for="item in flIsOrNoOpts"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
										<span style="float: left">{{
											item.value
										}}</span>
										<span
											style="
												float: right;
												font-size: 13px;
											"
											>{{ item.label }}</span
										>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								label="电话"
								prop="tel"
								v-if="orderForm.isDeliveryToDoor == 1"
							>
								<!-- <el-autocomplete
									size="mini"
									ref="tel"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'tel',
											'receiver',
											'电话',
											orderForm.tel,
											true,
											true
										)
									"
									@input="getReceicerData"
									@change="chooseReceiver"
									v-model="orderForm.tel"
									:style="{ width: itemWidth }"
									:fetch-suggestions="telQuerySearch"
									placeholder="电话"
									highlight-first-item
									popper-class="form-select-panel"
									:popper-append-to-body="false"
								>
									<template slot-scope="{ item }">
										<div class="sel-cell wd100 fellip">
											{{ (item.value = item.tel) }}
										</div>
										<div class="sel-cell wd60 fellip">
											{{ item.receiver }}
										</div>
										<div class="sel-cell wd140 fellip">
											{{ item.address }}
										</div>
									</template>
								</el-autocomplete> -->
								<el-select
									ref="tel"
									:style="{ width: itemWidth }"
									:disabled="disabledEdit"
									v-model="orderForm.tel"
									allow-create
									default-first-option
									filterable
									size="mini"
									remote
									:remote-method="getReceicerData"
									value-key="tel"
									popper-class="form-select-panel"
									:popper-append-to-body="false"
									@change="
										changeJump($event, 'tel', 'receiver')
									"
								>
									<el-option
										v-for="item in telRestaurants"
										:key="item.id"
										:label="item.tel"
										:value="item"
									>
										<div class="sel-cell wd100">
											{{ item.tel }}
										</div>
										<div class="sel-cell wd60">
											{{ item.receiver }}
										</div>
										<div class="sel-cell wd140">
											{{ item.address }}
										</div>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item
								label="收货人"
								v-if="orderForm.isDeliveryToDoor == 1"
								prop="receiver"
							>
								<el-input
									size="mini"
									ref="receiver"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'receiver',
											'address',
											'收货人',
											orderForm.receiver
										)
									"
									:style="{ width: itemWidth }"
									v-model="orderForm.receiver"
									placeholder="收货人"
								></el-input>
							</el-form-item>
							<el-form-item
								label="地址"
								prop="address"
								v-if="orderForm.isDeliveryToDoor == 1"
							>
								<el-input
									size="mini"
									ref="address"
									:disabled="disabledEdit"
									@keyup.enter.native="
										iptJump(
											'address',
											'chooseDrug',
											'地址',
											orderForm.address
										)
									"
									:style="{ width: '280px' }"
									v-model="orderForm.address"
									placeholder="地址"
								></el-input>
							</el-form-item>
						</el-form>
					</div>
					<div class="total-info-wrapper">
						<div class="info">
							共【{{ drugTotalInfo.allDoseNum }}】付,{{
								drugTotalInfo.flavourNumber
							}}味药,每付【￥{{
								drugTotalInfo.singleTotalAmount | formatMoney
							}}】,药费【￥{{
								drugTotalInfo.medicineFee | formatMoney
							}}】,代煎费【￥{{
								drugTotalInfo.totalDecoctFee | formatMoney
							}}】,总计【￥{{
								drugTotalInfo.totalAmount | formatMoney
							}}】
						</div>
						<div class="btn-groud">
							<el-button
								class="opt-btn"
								icon="el-icon-finished"
								size="mini"
								type="primary"
								:loading="submitLoading"
								@click="submitOrder"
								:disabled="orderForm.orderStatus >= 10"
								v-has-permission="['prescription:add']"
								>提交处方</el-button
							>
							<el-button
								class="opt-btn"
								icon="el-icon-bank-card"
								size="mini"
								type="success"
								:loading="confirmLoading"
								:disabled="
									!orderForm.orderStatus ||
									orderForm.orderStatus >= 11
								"
								v-has-permission="['prescription:confirm']"
								@click="confirmCharge"
								>确认收费</el-button
							>
							<el-button
								class="opt-btn"
								size="mini"
								icon="el-icon-printer"
								type="info"
								:disabled="!orderForm.orderStatus"
								@click="toPrint"
								>打印</el-button
							>
						</div>
						<div class="added-drug">
							<span>{{
								chooseedDrugInfo.name
									? chooseedDrugInfo.name + "已添加"
									: ""
							}}</span>
						</div>
					</div>
					<div class="filter-goods-wrapper">
						<el-form
							ref="form"
							:model="chooseGoodsForm"
							:inline="true"
							:rules="rules"
							class="custom-form"
						>
							<el-form-item label="药品">
								<el-select
									size="mini"
									ref="chooseDrug"
									style="width: 120px"
									popper-class="select-panel"
									:popper-append-to-body="false"
									:disabled="
										!orderForm.doseNum || disabledEdit
									"
									v-model="chooseGoodsForm.drug"
									default-first-option
									filterable
									value-key="id"
									:placeholder="
										orderForm.doseNum
											? '请输入选择'
											: '请确认主信息'
									"
									@change="chooseDrug"
									:loading="drugLoading"
									loading-text="药品获取中···"
									:filter-method="getDrugData"
									no-data-text="请输入匹配药品"
								>
									<el-option
										v-for="item in durgOptions"
										:key="item.id"
										:label="item.name"
										:value="item"
									>
										<div class="sel-tr">
											<div class="sel-cell cl-code wd100">
												{{ item.code }}
											</div>
											<div class="sel-cell cl-name wd100">
												{{ item.name }}
											</div>
											<div class="sel-cell cl-std wd100">
												{{ item.shorthandCode }}
											</div>
											<div class="sel-cell cl-sp wd60">
												{{ item.specification }}
											</div>
											<div class="sel-cell cl-po wd80">
												{{ item.placeOrigin }}
											</div>
											<div class="sel-cell cl-level wd40">
												{{ item.level }}
											</div>
											<div class="sel-cell cl-unit wd60">
												{{ item.unit | flUnitName }}
											</div>
											<div class="sel-cell cl-price wd60">
												{{ item.retailPrice }}
											</div>
											<div class="sel-cell cl-smpg wd40">
												{{
													item.isSmallPackage
														| flYesOrNo
												}}
											</div>
											<div class="sel-cell cl-fine wd40">
												{{ item.isFines | flYesOrNo }}
											</div>
											<div class="sel-cell cl-tox wd40">
												{{
													item.isToxicity | flYesOrNo
												}}
											</div>
											<div class="sel-cell cl-max wd40">
												{{ item.maxNumber }}
											</div>
											<div
												class="sel-cell cl-weight wd60"
											>
												{{ item.weight }}
											</div>
										</div>
									</el-option>
								</el-select>
								<el-input
									size="mini"
									style="width: 450px"
									v-model="chooseGoodsForm.drugInfo"
									readonly
									placeholder="药品信息"
								></el-input>
							</el-form-item>
							<el-form-item label="数量">
								<el-input
									size="mini"
									ref="qty"
									@keyup.enter.native="
										verifyAddGoods(
											'qty',
											'chooseDrug',
											'数量',
											chooseGoodsForm.qty
										)
									"
									:disabled="
										!orderForm.doseNum || disabledEdit
									"
									style="width: 120px"
									v-model.number="chooseGoodsForm.qty"
									v-number-only
									placeholder="数量"
								></el-input>
							</el-form-item>
							<el-form-item label="说明">
								<el-select
									size="mini"
									ref="remark"
									@change="
										verifyAddGoods(
											'remark',
											'chooseDrug',
											'说明',
											$event
										)
									"
									:disabled="
										!orderForm.doseNum || disabledEdit
									"
									:filter-method="filterDrugNoteOpts"
									popper-class="form-select-panel"
									:popper-append-to-body="false"
									style="width: 120px"
									v-model="chooseGoodsForm.remark"
									clearable
									filterable
									autocomplete="on"
									default-first-option
									placeholder="请选择"
								>
									<el-option
										v-for="item in flDrugNoteOpts"
										:label="item.name"
										:key="item.enumId"
										:value="item.name"
									>
										<div class="sel-cell wd60">
											{{ item.code }}
										</div>
										<div class="sel-cell wd60">
											{{ item.name }}
										</div>
										<div class="sel-cell wd60">
											{{ item.shorthandCode }}
										</div>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label>
								<el-button
									class="opt-btn"
									size="mini"
									@click="
										verifyAddGoods(
											'qty',
											'chooseDrug',
											'数量',
											chooseGoodsForm.qty
										)
									"
									>加入药品</el-button
								>
							</el-form-item>
							<div class="bg-color-tip flex-all-center">
								<div class="label-print flex-cross-center">
									<em class="bg-tag bg-tag__nosign"></em>
									<span class="tip-text fbold">需签字</span>
								</div>
								<div class="label-print flex-cross-center">
									<em
										class="bg-tag bg-tag__nocomparison"
									></em>
									<span class="tip-text fbold">无对照</span>
								</div>
								<div class="label-print flex-cross-center">
									<em class="bg-tag bg-tag__repetdrug"></em>
									<span class="tip-text fbold">重商品</span>
								</div>
							</div>
						</el-form>
					</div>
					<div class="drug-wrapper">
						<el-table
							ref="drugTable"
							:data="choosedDrugData"
							:header-cell-style="{
								background: '#eef1f6',
								color: '#606266',
							}"
							:row-class-name="tableSignFlag"
							:max-height="tableHeight"
							stripe
							border
							style="width: 100%"
						>
							<el-table-column
								type="index"
								width="50"
								align="center"
								label="序号"
							></el-table-column>
							<el-table-column
								align="center"
								prop="itemCode"
								min-width="100px"
								:show-overflow-tooltip="true"
								label="商品编码"
							></el-table-column>
							<el-table-column
								align="center"
								prop="itemName"
								min-width="80px"
								:show-overflow-tooltip="true"
								label="商品"
							></el-table-column>
							<el-table-column
								align="center"
								min-width="100px"
								prop="qty"
								label="数量"
							>
								<template slot-scope="scope">
									<el-input
										style="width: 85%"
										size="mini"
										:disabled="disabledEdit"
										@input="changeSumPrice(scope.row)"
										v-number-only
										v-model.number="scope.row.qty"
									></el-input>
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="specification"
								label="规格"
								:show-overflow-tooltip="true"
							></el-table-column>
							<el-table-column
								align="center"
								prop="unit"
								label="单位"
								min-width="60px"
								:show-overflow-tooltip="true"
							>
								<template slot-scope="{ row }">
									<span>{{ row.unit | flUnitName }}</span>
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="level"
								min-width="60px"
								:show-overflow-tooltip="true"
								label="等级"
							></el-table-column>
							<el-table-column
								align="center"
								prop="placeOrigin"
								min-width="60px"
								:show-overflow-tooltip="true"
								label="产地"
							></el-table-column>
							<el-table-column
								align="center"
								prop="price"
								label="单价"
								min-width="80px"
							></el-table-column>
							<el-table-column
								align="center"
								prop="amount"
								label="金额"
								min-width="80px"
							>
								<template slot-scope="{ row }">
									{{ row.amount | formatMoney }}
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="totalAmount"
								label="总金额"
								min-width="80px"
							>
								<template slot-scope="{ row }">
									{{ row.totalAmount | formatMoney }}
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="remark"
								label="说明"
								min-width="160px"
							>
								<template slot-scope="scope">
									<el-autocomplete
										size="mini"
										ref="remark"
										:disabled="disabledEdit"
										v-model="scope.row.remark"
										style="width: 85%"
										:fetch-suggestions="drugNoteQuerySearch"
										highlight-first-item
										popper-class="form-select-panel"
									>
										<template slot-scope="{ item }">
											<div class="sel-cell wd60">
												{{ (item.value = item.name) }}
											</div>
										</template>
									</el-autocomplete>
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="itemWeight"
								label="重量"
								min-width="60px"
							></el-table-column>
							<el-table-column
								align="center"
								prop="maxQty"
								label="最大剂量"
								min-width="80px"
							></el-table-column>
							<el-table-column
								align="center"
								prop="isToxicity"
								label="是否毒麻"
								min-width="80px"
							>
								<template slot-scope="scope">
									<span>{{
										scope.row.isToxicity | flYesOrNo
									}}</span>
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="isSmallPackage"
								label="是否小包装"
								min-width="100px"
							>
								<template slot-scope="scope">
									<span>{{
										scope.row.isSmallPackage | flYesOrNo
									}}</span>
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="isFines"
								label="是否细料"
								min-width="80px"
							>
								<template slot-scope="scope">
									<span>{{
										scope.row.isFines | flYesOrNo
									}}</span>
								</template>
							</el-table-column>

							<el-table-column
								v-if="!disabledEdit"
								label="操作"
								align="center"
								min-width="80px"
								fixed="right"
								class-name="small-padding fixed-width"
							>
								<template slot-scope="{ row, $index }">
									<i
										class="el-icon-delete table-operation"
										style="color: #f50"
										@click="singleDelete(row, $index)"
									/>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<el-dialog
						title="处方扫码"
						:visible.sync="scanCodeVisible"
						@close="cancelScanCode"
						:close-on-click-modal="false"
						:close-on-press-escape="false"
						class="scancode-dialog"
						width="90%"
					>
						<div class="scancode-container">
							<div class="lt-operate-wrapper">
								<div class="scancode_area">
									<div id="reader" ref="qrcode"></div>
								</div>
								<el-form
									ref="scanCodeForm"
									:model="scanCodeForm"
									:rules="scanCodeRules"
									@submit.native.prevent
								>
									<el-form-item
										label="处方码："
										class="scancode-form-item"
										prop="scanCodeStr"
									>
										<el-input
											ref="scanCodeStr"
											type="textarea"
											autosize
											:style="{ width: '100%' }"
											v-model.trim="
												scanCodeForm.scanCodeStr
											"
											placeholder="处方码"
											@keyup.enter.native="sureScanCode()"
										/>
									</el-form-item>
									<el-form-item
										label
										class="scancode-form-item"
									>
										<el-button
											type="info"
											size="mini"
											style="margin: auto"
											plain
											@click="pasteScanCode"
											>粘贴处方码</el-button
										>
									</el-form-item>
								</el-form>
							</div>
							<div class="rt-choose-wrapper">
								<el-table
									ref="table"
									v-loading="scanCodeLoading"
									:data="scanCodeList"
									border
									fit
									:header-cell-style="{
										background: '#eef1f6',
										color: '#606266',
									}"
									stripe
									highlight-current-row
									@current-change="chooseScanCode"
								>
									<el-table-column
										label="可选处方码"
										prop="prescriptionCode"
										align="center"
										show-overflow-tooltip
									></el-table-column>
									<el-table-column
										label="操作"
										align="center"
										width="60px"
										fixed="right"
										class-name="small-padding fixed-width"
									>
										<template slot-scope="{ row }">
											<i
												class="el-icon-delete table-operation"
												style="
													color: #f50;
													margin: auto;
												"
												@click.self="
													deleteScanCodeStr(row.id)
												"
											/>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button
								type="warning"
								plain
								@click="cancelScanCode"
								>取 消</el-button
							>
							<el-button
								type="primary"
								:loading="scanBtnLoading"
								plain
								@click="sureScanCode"
								>确 定</el-button
							>
						</div>
					</el-dialog>
				</div>
			</div>
		</res-split-pane>
	</div>
</template>
<script>
import { CURRENT_WEBSIT } from '@/config';
import { parseTime } from '@/utils';
import {
    sexOptions,
    isOrNoOptions,
    clincOrWardOptions
} from './js/selectOptions';
import splitPane from 'vue-splitpane';
import ResSplitPane from 'vue-resize-split-pane';
import PrescripteRecord from './components/PrescripteRecord';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';
import { debounce } from '@/utils';
import VueBarcode from 'vue-barcode';
import { Html5QrcodeScanner } from '@/utils/html5-qrcode-scanner';
export default {
    name: 'PrescriptionEnter',
    components: {
        splitPane,
        ResSplitPane,
        PrescripteRecord,
        VueBarcode
    },
    directives: {
        numberOnly
    },
    data() {
        return {
            source: null,
            disabledEdit: false, //是否允许编辑
            drugTotalInfo: {
                //药品合计费用
                allDoseNum: 0,
                flavourNumber: 0, //味数
                singleTotalAmount: 0,
                medicineFee: 0,
                totalDecoctFee: 0,
                totalAmount: 0
            },
            flSexOpts: Object.assign(sexOptions),
            flIsOrNoOpts: Object.assign(isOrNoOptions),
            flClincOrWardOpts: Object.assign(clincOrWardOptions),
            basicOrgData: {}, //当前登录人机构档案信息
            basicPatieninfData: [], //患者档案信息
            addressRestaurants: [], //地址联想框
            telRestaurants: [], //电话联想框
            receiverRestaurants: [], //收货人联想框
            departmentOptions: [],
            flDepOpts: [],
            physicianOptions: [],
            flPhysicianOpts: [],
            dosageOptions: [],
            flDosageOpts: [],
            diseaseSpeciesOptions: [], //临床诊断
            flDiseaseSpeciesOpts: [],
            flCarftOpts: [], //工艺
            flUrgentOpts: [], //紧急度
            flPrescriptionRemarkOpts: [], //处方备注
            flDrugNoteOpts: [], //药品说明
            allIncompatibilitys: [], //所有配伍禁忌商品
            itemWidth: '140px',
            paneWidth: 220, //固定窗格的宽度
            showRecord: true, //是否展示记录
            copyLoading: false, //处方复制loading
            submitLoading: false, //处方提交loading
            confirmLoading: false, //确认收费loading
            tableHeight: 0,
            durgOptions: [],
            drugLoading: false, //药品获取loading
            orderForm: {},
            chooseGoodsForm: {
                drugInfo: ''
            }, //选择商品表单
            supplierOptions: [],
            chooesedDrugItem: {}, //选过单个商品
            chooseedDrugInfo: {}, //选过单个商品信息
            choosedDrugData: [], //已选商品数据
            totalInfo: {
                //合计信息
            },
            scanner: null, //二维码扫码
            scanCodeVisible: false, //处方扫码弹窗
            scanCodeForm: {
                scanCodeStr: '',
                type: CURRENT_WEBSIT // 1协和医院扫描码 2其他医院扫描码
            },
            scanBtnLoading: false,
            scanCodeAppId: null, //已选择处方二维码
            scanCodeLoading: false,
            scanCodeList: [], //处方码
            scanCodeRules: {
                scanCodeStr: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ]
            },
            rules: {
                prescriptionNumber: [
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                medicalRecordNumber: [
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                patientName: [
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                sex: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                age: [{ required: true, message: ' ', trigger: 'blur' }],
                departmentName: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                physician: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                doseNum: [{ required: true, message: ' ', trigger: 'blur' }],
                dosage: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                technologyId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                instantLevel: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                isWard: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                wardArea: [{ required: true, message: ' ', trigger: 'blur' }],
                bedNumber: [{ required: true, message: ' ', trigger: 'blur' }],
                diseaseSpecies: [
                    { required: true, message: ' ', trigger: 'change' }
                ],
                prescriptionRemarkName: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                isMedicalInsurance: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                isDeliveryToDoor: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                address: [{ required: true, message: ' ', trigger: 'blur' }],
                tel: [{ required: true, message: ' ', trigger: 'blur' }],
                receiver: [{ required: true, message: ' ', trigger: 'blur' }]
            },
            restaurants: []
        };
    },
    watch: {
        'orderForm.orderStatus': {
            handler: function(status) {
                if (status >= 10) {
                    this.disabledEdit = true;
                } else {
                    this.disabledEdit = false;
                }
            }
        },
        'orderForm.doseNum': {
            handler: function(val) {
                this.drugTotalInfo.allDoseNum = this.orderForm.doseNum || 0;
                if (this.choosedDrugData.length) {
                    this.choosedDrugData.forEach(item => {
                        this.$set(
                            item,
                            'totalAmount',
                            item.qty * item.price * this.orderForm.doseNum
                        );
                    });
                }
            }
        },
        choosedDrugData: {
            handler: function() {
                this.countAllFee();
                this.findRepetDrug();
            },
            deep: true,
            immediate: false
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.account.user,
            userOrg: state => state.account.userOrg,
            carftOptions: state => state.enum.carfts,
            urgentOptions: state => state.enum.urgent,
            drugNoteOptions: state => state.enum.drugNotes
        }),
        ...mapGetters('basic', ['orgArchives'])
    },
    created() {
        this.getAllSupplier();
        this.setTableHeight();
        this.getAllDepartment();
        this.getAllPhysician();
        this.getAllDosage();
        this.getAllDiseaseSpecies();
        this.getAllPrescriptionRemark();
        this.getAllIncompatibility();
        this.getOrgBase();
    },
    mounted() {
        this.__resizeHandler = debounce(() => {
            this.setTableHeight();
        }, 100);
        this.$store.commit('setting/closeSidebar');
        window.addEventListener('resize', this.__resizeHandler);
        this.flCarftOpts = Object.assign(this.carftOptions);
        this.flUrgentOpts = Object.assign(this.urgentOptions);
        this.flDrugNoteOpts = Object.assign(this.drugNoteOptions);
        this.resetOrderForm();
    },
    methods: {
        //计算总计费用
        countAllFee() {
            this.drugTotalInfo.singleTotalAmount = 0;
            this.drugTotalInfo.medicineFee = 0;
            this.drugTotalInfo.totalDecoctFee = 0;
            this.drugTotalInfo.totalAmount = 0;
            this.drugTotalInfo.flavourNumber = 0;
            if (this.choosedDrugData.length) {
                this.choosedDrugData.forEach(item => {
                    this.drugTotalInfo.singleTotalAmount += item.amount;
                    this.drugTotalInfo.totalAmount += item.totalAmount;
                    this.drugTotalInfo.flavourNumber += 1;
                    if (item.isDecoctingFee == 1) {
                        this.drugTotalInfo.totalDecoctFee +=
							item.amount * this.orderForm.doseNum;
                        this.drugTotalInfo.flavourNumber -= 1; //是煎药费不记录味数
                    }
                });
                this.drugTotalInfo.medicineFee =
					this.drugTotalInfo.totalAmount -
					this.drugTotalInfo.totalDecoctFee;
            }
        },
        //验证是否有重复药品
        findRepetDrug() {
            let len = this.choosedDrugData.length;
            if (len) {
                let itemCodeArr = [];
                for (let i = 0; i < len; i++) {
                    let indexOf = itemCodeArr.indexOf(
                        this.choosedDrugData[i].itemCode
                    );
                    this.choosedDrugData[i].repetDrug = false;
                    if (indexOf != -1) {
                        this.choosedDrugData[i].repetDrug = true;
                        this.choosedDrugData[indexOf].repetDrug = true;
                        continue;
                    }
                    itemCodeArr.push(this.choosedDrugData[i].itemCode);
                }
            }
        },
        //选择处方码
        chooseScanCode(data) {
            if (data) {
                if (this.scanner) {
                    this.scanner.clear();
                }
                this.scanCodeForm.scanCodeStr = data.prescriptionCode;
                this.$refs.scanCodeForm.validateField('scanCodeStr');
                this.scanCodeAppId = data.id;
            }
        },
        //获取处方二维码串数据
        getScanCodeStrData() {
            this.scanCodeLoading = true;
            let params = {
                orgId: this.userInfo.orgId,
                startTime: this.$moment(new Date()).format('YYYY-DD-MM'),
                endTime: this.$moment(new Date()).format('YYYY-DD-MM')
            };
            this.$api
                .prescription_prescriptionOrder_getAllAppCode(params)
                .then(r => {
                    let { result } = r.data;
                    this.scanCodeList = result;
                    this.scanCodeLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.scanCodeLoading = false;
                });
        },
        //删除已选择处方二维码
        deleteScanCodeStr(scanCodeAppId) {
            let deleteId = [scanCodeAppId];
            this.$api
                .prescription_prescriptionOrder_deleteAppCode(deleteId)
                .then(() => {
                    this.scanCodeAppId = null;
                    this.scanCodeForm.scanCodeStr = '';
                    this.$refs.scanCodeForm.validateField('scanCodeStr');
                    this.getScanCodeStrData();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //取消扫码
        cancelScanCode() {
            this.scanCodeVisible = false;
            this.$refs.scanCodeForm.clearValidate();
            this.$refs.scanCodeForm.resetFields();
            if (this.scanner) {
                this.scanner.clear();
            }
            this.scanCodeForm = {
                scanCodeStr: '',
                type: CURRENT_WEBSIT
            };
        },
        //处方扫码
        openScanCode() {
            this.scanCodeVisible = true;
            this.scanCodeAppId = null;
            this.$nextTick(() => {
                this.$refs.scanCodeStr.focus();
                this.createQrcodeScanner();
                this.getScanCodeStrData();
            });
        },
        //创建二维码扫码
        createQrcodeScanner() {
            this.scanner = new Html5QrcodeScanner('reader', {
                fps: 2000,
                qrbox: 250,
                enableFileScan: false
            });
            this.scanner.render(
                this.onStartScan,
                this.onStopScan,
                this.onScanSuccess,
                this.onScanError
            );
        },
        //开始扫码
        onStartScan() {
            console.log('Action on start to scan here');
        },
        //停止扫码
        onStopScan() {
            console.log('Action on stop scanning here');
        },
        //二维码字符转义
        decodeStr(str) {
            var out, i, len, c;
            var char2, char3;
            out = '';
            len = str.length;
            i = 0;
            while (i < len) {
                c = str.charCodeAt(i++);
                switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    // 110x xxxx 10xx xxxx
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(
                        ((c & 0x1f) << 6) | (char2 & 0x3f)
                    );
                    break;
                case 14:
                    // 1110 xxxx 10xx xxxx 10xx xxxx
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(
                        ((c & 0x0f) << 12) |
								((char2 & 0x3f) << 6) |
								((char3 & 0x3f) << 0)
                    );
                    break;
                }
            }
            return out;
        },
        //扫码成功
        onScanSuccess(qrCodeMessage) {
            this.scanCodeForm.scanCodeStr = this.decodeStr(qrCodeMessage);
            this.$refs.scanCodeForm.validateField('scanCodeStr');
            this.scanner.clear();
        },
        //扫码失败
        onScanError(errorMessage) {
            this.scanCodeForm.scanCodeStr = '';
        },
        //粘贴处方扫码
        pasteScanCode() {
            try {
                navigator.clipboard
                    .readText()
                    .then(text => {
                        this.scanCodeForm.scanCodeStr = text;
                        this.$refs.scanCodeForm.validateField('scanCodeStr');
                    })
                    .catch(err => {
                        console.error(
                            'Failed to read clipboard contents: ',
                            err
                        );
                    });
            } catch (error) {
                console.log(error);
                this.$message({
                    message: '浏览器不支持该功能',
                    type: 'info'
                });
            }
        },
        //扫码确认
        sureScanCode() {
            this.$refs.scanCodeForm.validate(valid => {
                if (valid) {
                    this.resetOrderForm();
                    let params = this.scanCodeForm;
                    this.scanBtnLoading = true;
                    this.$api
                        .prescription_prescriptionOrder_scanCode(params)
                        .then(res => {
                            let { code, result } = res.data;
                            if (code == 200) {
                                this.scanCodeVisible = false;
                                this.orderForm = result;
                                this.orderForm.isDeliveryToDoor = 2;
                                this.orderForm.isMedicalInsurance = result.isMedicalInsurance
                                    ? Number(result.isMedicalInsurance)
                                    : '';
                                this.urgentOptions.forEach(item => {
                                    if (item.name == '普通') {
                                        this.$set(
                                            this.orderForm,
                                            'instantLevel',
                                            item.enumId
                                        ); //设置紧急度
                                    }
                                });
                                let dealScanCodeDetailList = []; //处理扫码后的药品列
                                result.scanCodeDetailRepList.forEach(item => {
                                    let len = this.drugNoteOptions.length || 0;
                                    //修改扫码后的说明  得到对应文案
                                    for (let i = 0; i < len; i++) {
                                        if (
                                            item.remark ==
											this.drugNoteOptions[i].enumId
                                        ) {
                                            item.remark = this.drugNoteOptions[
                                                i
                                            ].name;
                                            break;
                                        }
                                    }
                                    let isExistIncompatibility = this.allIncompatibilitys.some(
                                        _v => {
                                            return (
                                                _v.drug1Id == item.itemId ||
												_v.drug2Id == item.itemId
                                            );
                                        }
                                    );
                                    if (isExistIncompatibility) {
                                        this.$set(
                                            item,
                                            'isExistIncompatibility',
                                            true
                                        );
                                    }
                                    dealScanCodeDetailList.push(item);
                                    //查询是否有禁忌商品
                                    dealScanCodeDetailList.forEach(_i => {
                                        if (_i.isExistIncompatibility) {
                                            let relateIncompatibility = [];
                                            relateIncompatibility = this.allIncompatibilitys.filter(
                                                _c =>
                                                    (_c.drug1Id == _i.itemId &&
														_c.drug2Id ==
															item.itemId) ||
													(_c.drug2Id == _i.itemId &&
														_c.drug1Id ==
															item.itemId)
                                            ); //有关联禁忌商品
                                            relateIncompatibility.forEach(
                                                _h => {
                                                    if (
                                                        _c =>
                                                            _c.drug1Id ==
																item.itemId ||
															_c.drug2Id ==
																item.itemId
                                                    ) {
                                                        this.$set(
                                                            item,
                                                            'incompNeedSign',
                                                            true
                                                        );
                                                        this.$set(
                                                            _i,
                                                            'incompNeedSign',
                                                            true
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    });
                                    if (
                                        item.qty * item.itemWeight >
										item.maxQty
                                    ) {
                                        this.$set(item, 'exceedLimit', true);
                                    } else {
                                        this.$set(item, 'exceedLimit', false);
                                    }
                                });
                                this.choosedDrugData = dealScanCodeDetailList;
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'error'
                                });
                            }
                            this.scanBtnLoading = false;
                        })
                        .catch(err => {
                            console.log(err);
                            this.scanBtnLoading = false;
                        });
                } else {
                    this.$message({
                        message: '处方码不能为空',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        //去打印
        toPrint() {
            let hostUrl = window.location.origin + window.location.pathname;
            let routeUrl = this.$router.resolve({
                path: '/print/preview',
                query: {
                    printType: 'prescriptionEnter',
                    orderNo: this.orderForm.orderNo
                }
            });
            window.open(
                hostUrl + routeUrl.href + '&timestamp=' + new Date().getTime(),
                'printPage',
                'height=800,width=800,top=0,left=800,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no, status=no'
            );
        },
        telQuerySearch(queryString, cb) {
            console.log(queryString, 8989);
            var results = queryString
                ? this.telRestaurants.filter(item => {
                    if (!!~item.tel.indexOf(queryString)) {
                        return true;
                    }
				  })
                : Object.assign(this.telRestaurants);
            cb(results);
        },
        receiverQuerySearch(queryString, cb) {
            var receiverRestaurants = this.receiverRestaurants;
            var results = queryString
                ? receiverRestaurants.filter(this.createFilter(queryString))
                : receiverRestaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        addressQuerySearch(queryString, cb) {
            var addressRestaurants = this.addressRestaurants;
            var results = queryString
                ? addressRestaurants.filter(this.createFilter(queryString))
                : addressRestaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        //临床诊断过滤下拉框
        diseaseSpeciesQuerySearch(queryString, cb) {
            var results = queryString
                ? this.diseaseSpeciesOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(queryString) ||
							!!~item.name.indexOf(queryString) ||
							~item.shorthandCode.indexOf(queryString)
                    ) {
                        return true;
                    }
				  })
                : Object.assign(this.diseaseSpeciesOptions);
            cb(results);
        },
        //处方备注过滤下拉框
        prescriptionRemarkQuerySearch(queryString, cb) {
            var results = queryString
                ? this.prescriptionRemarkOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(queryString) ||
							!!~item.name.indexOf(queryString) ||
							~item.shorthandCode.indexOf(queryString)
                    ) {
                        return true;
                    }
				  })
                : Object.assign(this.prescriptionRemarkOptions);
            cb(results);
        },
        //药品说明过滤下拉框
        drugNoteQuerySearch(queryString, cb) {
            var results = queryString
                ? this.drugNoteOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(queryString) ||
							!!~item.name.indexOf(queryString) ||
							~item.shorthandCode.indexOf(queryString)
                    ) {
                        return true;
                    }
				  })
                : Object.assign(this.drugNoteOptions);
            cb(results);
        },
        //科室过滤下拉框
        departmentNameQuerySearch(queryString, cb) {
            var results = queryString
                ? this.departmentOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(queryString) ||
							!!~item.name.indexOf(queryString)
                    ) {
                        return true;
                    }
				  })
                : Object.assign(this.departmentOptions);
            cb(results);
        },
        //医师过滤下拉框
        physicianQuerySearch(queryString, cb) {
            var results = queryString
                ? this.physicianOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(queryString) ||
							!!~item.name.indexOf(queryString) ||
							~item.shorthandCode.indexOf(queryString)
                    ) {
                        return true;
                    }
				  })
                : Object.assign(this.physicianOptions);
            cb(results);
        },

        createFilter(queryString, restaurants) {
            return restaurant => {
                return (
                    restaurant.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },
        //未签字认证
        tableSignFlag({ row, rowIndex }) {
            //毒麻且超最大剂量或存在禁忌商品需签字
            if (
                (row.exceedLimit &&
					row.isToxicity == 1 &&
					row.remark.indexOf('已签字') == -1) ||
				(row.incompNeedSign && row.remark.indexOf('已签字') == -1)
            ) {
                return 'no-sign';
            }
            if (row.existOrgDugCode == 2) {
                return 'no-comparison';
            }
            if (row.repetDrug) {
                return 'repet-drug';
            }
            return '';
        },
        //select 自定义过滤options
        filterSexOpts(val) {
            this.$set(this.orderForm, 'sex', val);
            if (val) {
                this.flSexOpts = sexOptions.filter(item => {
                    if (!!~item.label.indexOf(val) || item.value == val) {
                        return true;
                    }
                });
            } else {
                this.flSexOpts = Object.assign(sexOptions);
            }
        },
        filterIsOrNoOpts(val) {
            if (val) {
                this.flIsOrNoOpts = isOrNoOptions.filter(item => {
                    if (!!~item.label.indexOf(val) || item.value == val) {
                        return true;
                    }
                });
            } else {
                this.flIsOrNoOpts = Object.assign(isOrNoOptions);
            }
        },
        filterClincOrWardOpts(val) {
            if (val) {
                this.flClincOrWardOpts = clincOrWardOptions.filter(item => {
                    if (!!~item.label.indexOf(val) || item.value == val) {
                        return true;
                    }
                });
            } else {
                this.flClincOrWardOpts = Object.assign(clincOrWardOptions);
            }
        },
        filterDepOpts(val) {
            if (val) {
                this.flDepOpts = this.departmentOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(val) ||
						!!~item.name.indexOf(val) ||
						!!~item.shorthandCode.indexOf(val)
                    ) {
                        return true;
                    }
                });
            } else {
                this.flDepOpts = Object.assign(this.departmentOptions);
            }
        },
        filterPhysicianOpts(val) {
            if (val) {
                this.flPhysicianOpts = this.physicianOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(val) ||
						!!~item.name.indexOf(val) ||
						!!~item.shorthandCode.indexOf(val)
                    ) {
                        return true;
                    }
                });
            } else {
                this.flPhysicianOpts = Object.assign(this.physicianOptions);
            }
        },
        filterDosageOpts(val) {
            if (val) {
                this.flDosageOpts = this.dosageOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(val) ||
						!!~item.name.indexOf(val) ||
						!!~item.shorthandCode.indexOf(val)
                    ) {
                        return true;
                    }
                });
            } else {
                this.flDosageOpts = Object.assign(this.dosageOptions);
            }
        },
        filterDiseaseSpeciesOpts(val) {
            if (val) {
                this.flDiseaseSpeciesOpts = this.diseaseSpeciesOptions.filter(
                    item => {
                        if (
                            !!~item.code.indexOf(val) ||
							!!~item.name.indexOf(val) ||
							!!~item.shorthandCode.indexOf(val)
                        ) {
                            return true;
                        }
                    }
                );
            } else {
                this.flDiseaseSpeciesOpts = Object.assign(
                    this.diseaseSpeciesOptions
                );
            }
        },
        filterCarftOpts(val) {
            if (val) {
                this.flCarftOpts = this.carftOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(val) ||
						!!~item.name.indexOf(val) ||
						!!~item.shorthandCode.indexOf(val)
                    ) {
                        return true;
                    }
                });
            } else {
                this.flCarftOpts = Object.assign(this.carftOptions);
            }
        },
        filterUrgentOpts(val) {
            if (val) {
                this.flUrgentOpts = this.urgentOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(val) ||
						!!~item.name.indexOf(val) ||
						!!~item.shorthandCode.indexOf(val)
                    ) {
                        return true;
                    }
                });
            } else {
                this.flUrgentOpts = Object.assign(this.urgentOptions);
            }
        },
        filterPrescriptionRemarkOpts(val) {
            if (val) {
                this.flPrescriptionRemarkOpts = this.prescriptionRemarkOptions.filter(
                    item => {
                        if (
                            !!~item.code.indexOf(val) ||
							!!~item.name.indexOf(val)
                        ) {
                            return true;
                        }
                    }
                );
            } else {
                this.flPrescriptionRemarkOpts = Object.assign(
                    this.prescriptionRemarkOptions
                );
            }
        },
        filterDrugNoteOpts(val) {
            if (val) {
                this.flDrugNoteOpts = this.drugNoteOptions.filter(item => {
                    if (
                        !!~item.code.indexOf(val) ||
						!!~item.name.indexOf(val) ||
						!!~item.shorthandCode.indexOf(val)
                    ) {
                        return true;
                    }
                });
            } else {
                this.flDrugNoteOpts = Object.assign(this.drugNoteOptions);
            }
        },
        //获取所有科室
        getAllDepartment() {
            this.$api.basic_baseDepartment_all().then(res => {
                let { result } = res.data;
                this.flDepOpts = this.departmentOptions = result;
            });
        },
        //获取所有医师
        getAllPhysician() {
            this.$api.basic_basePhysician_all().then(res => {
                let { result } = res.data;
                this.flPhysicianOpts = this.physicianOptions = result;
            });
        },
        //获取所有用法用量
        getAllDosage() {
            this.$api.basic_baseDosage_all().then(res => {
                let { result } = res.data;
                this.flDosageOpts = this.dosageOptions = result;
            });
        }, //获取所有临床诊断
        getAllDiseaseSpecies() {
            this.$api.basic_baseDiseaseSpecies_all().then(res => {
                let { result } = res.data;
                this.flDiseaseSpeciesOpts = this.diseaseSpeciesOptions = result;
            });
        },
        //获取所有处方备注
        getAllPrescriptionRemark() {
            this.$api.basic_basePrescriptionRemark_all().then(res => {
                let { result } = res.data;
                this.flPrescriptionRemarkOpts = this.prescriptionRemarkOptions = result;
            });
        },
        //获取所有配伍禁忌
        getAllIncompatibility() {
            this.$api.basic_baseIncompatibility_all().then(res => {
                let { result } = res.data;
                this.allIncompatibilitys = result;
            });
        },
        //选中收货人
        chooseReceiver(item) {
            this.$set(this.orderForm, 'receiver', '');
            this.$set(this.orderForm, 'address', '');
            if (item && typeof item == 'object') {
                this.$set(this.orderForm, 'receiver', item.receiver);
                this.$set(this.orderForm, 'address', item.address);
                this.$refs.orderForm.validateField('receiver');
                this.$refs.orderForm.validateField('address');
            }
        },
        //获取收货人列表
        getReceicerData(val) {
            let params = {
                tel: val
            };
            this.addressRestaurants = [];
            this.telRestaurants = [];
            this.receiverRestaurants = [];
            this.$api
                .prescription_prescriptionOrder_receiverList(params)
                .then(res => {
                    let { result } = res.data;
                    this.basicPatieninfData = result;
                    result.forEach(item => {
                        if (item.address) {
                            this.addressRestaurants.push({
                                address: item.address,
                                tel: item.tel,
                                receiver: item.receiver
                            });
                        }
                        if (item.tel) {
                            this.telRestaurants.push({
                                address: item.address,
                                tel: item.tel,
                                receiver: item.receiver
                            });
                        }
                        if (item.receiver) {
                            this.receiverRestaurants.push({
                                address: item.address,
                                tel: item.tel,
                                receiver: item.receiver
                            });
                        }
                    });
                });
        },
        //获取机构档案信息
        getOrgBase() {
            let params = {
                orgId: this.userInfo.orgId
            };
            this.$api.basic_baseOrg_all(params).then(r => {
                const data = r.data.result;
                this.basicOrgData = data.filter(
                    v => v.id == this.userInfo.orgId
                )[0];
                this.$set(
                    this.orderForm,
                    'isMedicalInsurance',
                    Number(this.basicOrgData.mipdValue)
                );
            });
        },
        //重置表单
        resetOrderForm() {
            this.$refs.prescriptionNumber.focus();
            this.$refs.orderForm.clearValidate();
            this.$refs.orderForm.resetFields();
            this.orderForm = {};
            this.$set(
                this.orderForm,
                'isMedicalInsurance',
                Number(this.basicOrgData.mipdValue)
            ); //初始化医保
            this.$set(
                this.orderForm,
                'prescriptionNumber',
                parseTime(new Date(), '{y}-{m}-{d}')
            ); //初始化处方号
            this.$set(this.orderForm, 'isDeliveryToDoor', 2); //初始化是否送货上门
            this.urgentOptions.forEach(item => {
                if (item.name == '普通') {
                    this.$set(this.orderForm, 'instantLevel', item.enumId); //初始化紧急度
                }
            });
            this.disabledEdit = false;
            this.choosedDrugData = [];
            this.chooesedDrugItem = {};
            this.addressRestaurants = [];
            this.telRestaurants = [];
            this.receiverRestaurants = [];
        },
        //新建
        create() {
            this.$confirm('此操作将清空当前单据内容, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.resetOrderForm();
                this.scanCodeAppId = null;
            });
        },
        //修改
        modify() {
            this.disabledEdit = false;
            this.orderForm.orderStatus = 0; //待提交状态
        },
        //撤销
        backOut() {
            let params = {
                prescriptionOrderId: this.orderForm.id
            };
            this.$api
                .prescription_prescriptionOrder_backOut(params)
                .then(res => {
                    let { code, msg } = res.data;
                    if (code == 200) {
                        this.$message({
                            message: '处方撤销成功',
                            type: 'success'
                        });
                        this.resetOrderForm();
                        this.$refs.prescripteRecord.search();
                        this.scanCodeAppId = null;
                    } else {
                        this.$message({
                            message: msg,
                            type: 'warning'
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.confirmLoading = false;
                });
        },
        //复制
        copy() {
            let params = {
                prescriptionOrderId: this.orderForm.id
            };
            this.copyLoading = true;
            this.$api
                .prescription_prescriptionOrder_copy(params)
                .then(res => {
                    let { code, msg, result } = res.data;
                    if (code == 200) {
                        this.$message({
                            message: '处方复制成功',
                            type: 'success'
                        });
                        this.orderForm = result;
                        this.orderForm.id = null;
                        this.orderForm.orderNo = '';
                        this.orderForm.orderStatus = ''; //待提交状态
                        this.disabledEdit = false;
                        this.chooseedDrugInfo.name = '';
                        this.scanCodeAppId = null;
                    } else {
                        this.$message({
                            message: msg,
                            type: 'warning'
                        });
                    }
                    this.copyLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.copyLoading = false;
                });
        },
        /**
		 * @param {String} curRefKey 当前refKey
		 * @param {String} nextRefkey 当前refKey
		 * @param {String} curRefname 当前ref名字
		 * @param {String} val 输入框值
		 * @param {Boolean} verify 是否验证已输入
		 * @param {Boolean} autoCom 是否为el-autocomplete组件
		 * @description input enter跳转
		 */
        iptJump(
            curRefKey,
            nextRefkey,
            curRefname,
            val,
            verify = true,
            autoCom = false
        ) {
            if (verify && !val) {
                this.$message({
                    message: `请输入${curRefname}`,
                    type: 'warning'
                });
            } else {
                this.$nextTick(() => {
                    setTimeout(() => {
                        if (curRefKey == 'prescriptionRemarkName') {
                            //处方备注填写完成直接选择药品
                            this.$refs[
                                'prescriptionRemarkName'
                            ].suggestions = [];
                            this.$refs['chooseDrug'].focus();
                            return;
                        } else {
                            if (autoCom) {
                                this.$refs[curRefKey].suggestions = [];
                            } else {
                                this.$refs[curRefKey].blur();
                            }
                            this.$refs[nextRefkey].focus();
                            return;
                        }
                    }, 100);
                });
            }
        },
        //select change跳转
        changeJump(
            val,
            curRefKey,
            nextName,
            targetKey = '',
            targetName = '',
            flOptions = []
        ) {
            if (val) {
                this.$nextTick(() => {
                    this.flSexOpts = Object.assign(sexOptions);
                    this.flIsOrNoOpts = Object.assign(isOrNoOptions);
                    this.flClincOrWardOpts = Object.assign(clincOrWardOptions);
                    this.flDepOpts = Object.assign(this.departmentOptions);
                    this.flPhysicianOpts = Object.assign(this.physicianOptions);
                    this.flDosageOpts = Object.assign(this.dosageOptions);
                    this.flDiseaseSpeciesOpts = Object.assign(
                        this.diseaseSpeciesOptions
                    );
                    this.flCarftOpts = Object.assign(this.carftOptions);
                    this.flUrgentOpts = Object.assign(this.urgentOptions);
                    this.flPrescriptionRemarkOpts = Object.assign(
                        this.prescriptionRemarkOptions
                    );
                    if (targetName) {
                        this[flOptions].forEach(item => {
                            if (item[targetKey] == val) {
                                this.orderForm[targetName] = item.name;
                            }
                        });
                    }

                    setTimeout(() => {
                        this.$refs[curRefKey].blur();
                        //机构扫码解析对应方案三选择工艺  门诊病房有值时不继续后跳
                        if (
                            curRefKey == 'technologyId' &&
							this.userOrg.qrcodeRule == '1003'
                        ) {
                            if (this.orderForm.isWard) return;
                        }
                        if (curRefKey == 'tel') {
                            this.chooseReceiver(val);
                        }
                        if (curRefKey == 'isWard' && val == 2) {
                            this.$refs['diseaseSpecies'].focus();
                        } else if (
                            curRefKey == 'isDeliveryToDoor' &&
							val == 2
                        ) {
                            this.$refs['chooseDrug'].focus();
                        } else if (curRefKey == 'technologyId') {
                            this.$refs['isWard'].focus();
                        } else {
                            this.$refs[nextName].focus();
                        }
                    }, 100);
                });
            }
        },
        //记录开关
        recordToggle() {
            this.paneWidth = this.showRecord ? 0 : 220;
            this.showRecord = !this.showRecord;
        },
        //面板resize
        paneResize(val) {
            this.$refs.prescripteRecord.setRecordListHeight();
            this.setTableHeight();
        },
        //选择订单
        chooseOrder(data) {
            this.disabledEdit = true;
            this.orderForm = JSON.parse(JSON.stringify(data));
            this.drugTotalInfo.allDoseNum = data.doseNum;
            this.choosedDrugData = JSON.parse(
                JSON.stringify(data.prescriptionOrderDetailList)
            );
        },
        //移出已选商品
        singleDelete(row, index) {
            this.$confirm('该数据将被移除, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.choosedDrugData.splice(index, 1);
                this.choosedDrugData.forEach(_i => {
                    if (_i.isExistIncompatibility) {
                        let relateIncompatibility = [];
                        relateIncompatibility = this.allIncompatibilitys.filter(
                            _c =>
                                (_c.drug1Id == _i.itemId &&
									_c.drug2Id == row.itemId) ||
								(_c.drug2Id == _i.itemId &&
									_c.drug1Id == row.itemId)
                        ); //有关联禁忌商品
                        relateIncompatibility.forEach(_h => {
                            if (
                                _c =>
                                    _c.drug1Id == row.itemId ||
									_c.drug2Id == row.itemId
                            ) {
                                this.$set(_i, 'incompNeedSign', false);
                            }
                        });
                    }
                });
            });
        },
        //提交处方
        submitOrder() {
            let havaNoCom = false; //是否有无机构对照数据
            let noComIndex = '';
            this.choosedDrugData.forEach((item, index) => {
                if (item.existOrgDugCode == 2) {
                    havaNoCom = true;
                    noComIndex += index + 1 + ',';
                }
            });
            if (havaNoCom) {
                noComIndex = noComIndex.substring(0, noComIndex.length - 1);
                this.$message({
                    message: `第${noComIndex}行数据药品无对照，请前往机构对照档案维护`,
                    type: 'error'
                });
                return;
            }
            this.$refs.orderForm.validate(valid => {
                if (valid) {
                    if (!this.choosedDrugData.length) {
                        this.$message({
                            message: '请添加药品！',
                            type: 'error'
                        });
                        return;
                    }

                    let verifySignPass = true;
                    let haveRepetDrug = false; //

                    this.choosedDrugData.forEach(v => {
                        if (
                            (v.exceedLimit &&
								v.isToxicity == 1 &&
								v.remark.indexOf('已签字') == -1) ||
							(v.incompNeedSign &&
								v.remark.indexOf('已签字') == -1)
                        ) {
                            verifySignPass = false;
                        }
                        if (v.repetDrug) {
                            haveRepetDrug = true;
                        }
                    });

                    if (!verifySignPass) {
                        this.$message({
                            message: '标红需备注“已签字”',
                            type: 'error'
                        });
                        return false;
                    }
                    if (haveRepetDrug) {
                        this.$message({
                            message: '有相同商品，不删除不可提交处方',
                            type: 'error'
                        });
                        return false;
                    }
                    let verifgTechnoPass = true; //工艺为代煎时需验证商品是否有代煎费
                    if (this.orderForm.technologyName.indexOf('代煎') != -1) {
                        verifgTechnoPass = this.choosedDrugData.some(
                            item => item.isDecoctingFee == 1
                        );
                    }
                    //工艺为代煎且该机构需收代煎费
                    if (!verifgTechnoPass && this.userOrg.fryingFee == 1) {
                        this.$message({
                            message: '当前工艺为代煎，请录入代煎费',
                            type: 'error'
                        });
                        return false;
                    }
                    if (
                        this.orderForm.tel &&
						typeof this.orderForm.tel == 'object'
                    ) {
                        this.orderForm.tel = this.orderForm.tel.tel;
                    }
                    let params = this.orderForm;
                    params.orderType = 1; // 1=新开 2=重发
                    params.flavourNumber = this.drugTotalInfo.flavourNumber; //味数
                    this.orderForm.prescriptionOrderDetailList = [];
                    let isNotDecoct = 1; //是否不煎
                    if (
                        this.orderForm.technologyName.indexOf('自煎') != -1 ||
						this.orderForm.technologyName.indexOf('代煎') != -1 ||
						this.orderForm.technologyName.indexOf('帅府代煎') !=
							-1 ||
						this.orderForm.technologyName.indexOf('另包') != -1 ||
						this.orderForm.technologyName.indexOf('冲服') != -1 ||
						this.orderForm.technologyName.indexOf('烊化') != -1 ||
						this.orderForm.technologyName.indexOf('另煎') != -1 ||
						this.orderForm.technologyName.indexOf('另包不煎') != -1
                    ) {
                        isNotDecoct = 1;
                    } else {
                        isNotDecoct = 2;
                    }
                    this.choosedDrugData.forEach((item, index) => {
                        this.orderForm.prescriptionOrderDetailList.push({
                            amount: item.amount,
                            isDecoctingFee: item.isDecoctingFee,
                            isFines: item.isFines,
                            isNotDecoct: isNotDecoct,
                            isSmallPackage: item.isSmallPackage,
                            isToxicity: item.isToxicity,
                            itemCode: item.itemCode,
                            itemId: item.itemId,
                            itemName: item.itemName,
                            itemWeight: item.itemWeight,
                            level: item.level,
                            location: item.location,
                            maxQty: item.maxQty,
                            placeOrigin: item.placeOrigin,
                            price: item.price,
                            qty: item.qty,
                            remark: item.remark,
                            rid: index + 1,
                            taxRate: item.taxRate,
                            unit: item.unit,
                            specification: item.specification
                        });
                    });
                    this.submitLoading = true;
                    if (this.orderForm.id) {
                        params.orderStatus = 10;
                        this.$api
                            .prescription_prescriptionOrder_modify(params)
                            .then(res => {
                                let { code, msg } = res.data;
                                this.submitLoading = false;
                                if (code == 200) {
                                    this.orderForm.orderStatus = 10;
                                    this.chooseedDrugInfo.name = '';
                                    this.$notify({
                                        title: '成功',
                                        message: '修改处方成功 ',
                                        type: 'success'
                                    });
                                    this.$refs.prescripteRecord.search();
                                } else {
                                    this.$message({
                                        message: msg,
                                        type: 'warning'
                                    });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                this.submitLoading = false;
                            });
                    } else {
                        if (params.scanCodeDetailRepList) {
                            delete params.scanCodeDetailRepList;
                        }
                        this.$api
                            .prescription_prescriptionOrder_submit(params)
                            .then(res => {
                                let { result, code, msg } = res.data;
                                this.submitLoading = false;
                                if (code == 200) {
                                    this.orderForm.orderNo = result.orderNo;
                                    this.orderForm.orderStatus =
										result.orderStatus;
                                    this.orderForm.orderStatusName =
										result.orderStatusName;
                                    this.orderForm.id =
										result.prescriptionOrderId;
                                    this.chooseedDrugInfo.name = '';
                                    this.$notify({
                                        title: '成功',
                                        message: '处方提交成功 ',
                                        type: 'success'
                                    });
                                    this.$refs.prescripteRecord.search();
                                    if (this.scanCodeAppId) {
                                        this.deleteScanCodeStr(
                                            this.scanCodeAppId
                                        );
                                    }
                                } else {
                                    this.$message({
                                        message: msg,
                                        type: 'warning'
                                    });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                this.submitLoading = false;
                            });
                    }
                } else {
                    this.$message({
                        message: '请输入表单信息！',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        //确认收费
        confirmCharge() {
            let params = {
                prescriptionOrderId: this.orderForm.id
            };
            this.confirmLoading = true;
            this.$api
                .prescription_prescriptionOrder_confirmCharge(params)
                .then(res => {
                    let { code, msg } = res.data;
                    this.confirmLoading = false;
                    if (code == 200) {
                        this.orderForm.orderStatus = 11;
                        this.$notify({
                            title: '成功',
                            message: '确认收费成功 ',
                            type: 'success'
                        });
                        this.$refs.prescripteRecord.search();
                    } else {
                        this.$message({
                            message: msg,
                            type: 'warning'
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.confirmLoading = false;
                });
        },
        getAllSupplier() {
            this.$api.basic_baseSupplier_all().then(res => {
                let { result } = res.data;
                this.supplierOptions = result;
            });
        },
        //设置table最大高度
        setTableHeight() {
            this.$nextTick(() => {
                let creenHeight = document.body.clientHeight;
                let mainFormHeight = 170;
                let tatalInfoHeight = 40;
                let filterGoodsHeight = 40;
                let marginHeight = 70;
                let footerHeight = 40;
                let fixedHeight = 85;
                if (document.getElementsByClassName('fixed-header').length) {
                    fixedHeight = document.getElementsByClassName(
                        'fixed-header'
                    )[0].offsetHeight;
                }
                if (
                    document.getElementsByClassName('mainForm-wrapper').length
                ) {
                    mainFormHeight = document.getElementsByClassName(
                        'mainForm-wrapper'
                    )[0].offsetHeight;
                }
                if (
                    document.getElementsByClassName('filter-goods-wrapper')
                        .length
                ) {
                    filterGoodsHeight = document.getElementsByClassName(
                        'filter-goods-wrapper'
                    )[0].offsetHeight;
                }
                this.tableHeight =
					creenHeight -
					fixedHeight -
					mainFormHeight -
					tatalInfoHeight -
					filterGoodsHeight -
					footerHeight -
					marginHeight;
            });
        },
        //选择药品
        chooseDrug(item) {
            this.chooseGoodsForm.drugInfo = `${item.code}|${item.name}|${
                item.shorthandCode
            }|${item.specification || '--'}|${item.placeOrigin ||
				'--'}|${item.level || '--'}|${this.$options.filters[
                'flUnitName'
            ](item.unit)}|${item.retailPrice || '--'}|${this.$options.filters[
                'flYesOrNo'
            ](item.isSmallPackage)}|${this.$options.filters['flYesOrNo'](
                item.isFines
            )}|${this.$options.filters['flYesOrNo'](
                item.isToxicity
            )}|${item.maxNumber || '--'}|${item.weight || '--'}`;
            this.chooesedDrugItem = item;
            let drugNotes = this.drugNoteOptions.filter(
                v => v.enumId == item.remark
            );
            let remark = '';
            if (drugNotes.length) {
                remark = drugNotes[0].name;
            }
            this.chooseGoodsForm.remark = remark;
            this.chooesedDrugItem.itemCode = item.code;
            this.chooesedDrugItem.itemId = item.id;
            this.chooesedDrugItem.itemName = item.name;
            this.chooesedDrugItem.itemWeight = item.weight;
            this.chooesedDrugItem.maxQty = item.maxNumber;
            this.chooesedDrugItem.price = item.retailPrice;
            this.changeJump(item, 'chooseDrug', 'qty');
        },
        //计算价格
        changeSumPrice(item) {
            this.$set(item, 'amount', item.qty * item.price);
            this.$set(
                item,
                'totalAmount',
                item.qty * item.price * this.orderForm.doseNum
            );
            if (item.qty * item.itemWeight > item.maxQty) {
                this.$set(item, 'exceedLimit', true);
                if (item.isToxicity == 1) {
                    this.$message({
                        message: `${item.itemName}为毒麻药品且超过最大剂量需签字!`,
                        type: 'error'
                    });
                } else {
                    this.$message({
                        message: `${item.itemName}超过最大剂量!`,
                        type: 'error'
                    });
                }
            } else {
                this.$set(item, 'exceedLimit', false);
            }
        },
        //清除添加商品信息
        clearChooseGoods(curRefKey, nextRefkey, curRefname, val) {
            this.flDrugNoteOpts = Object.assign(this.drugNoteOptions);
            this.chooesedDrugItem = {};
            this.durgOptions = [];
            this.chooseGoodsForm.drug = '';
            this.chooseGoodsForm.drugInfo = '';
            this.chooseGoodsForm.qty = '';
            this.chooseGoodsForm.remark = '';
            this.iptJump(curRefKey, nextRefkey, curRefname, val);
        },
        //确定添加商品
        sureAddGoods(curRefKey, nextRefkey, curRefname, val) {
            this.$set(this.chooesedDrugItem, 'qty', this.chooseGoodsForm.qty);
            this.$set(
                this.chooesedDrugItem,
                'remark',
                this.chooseGoodsForm.remark
            );
            this.changeSumPrice(this.chooesedDrugItem);
            this.chooesedDrugItem.remark = this.chooseGoodsForm.remark;
            this.choosedDrugData.push(this.chooesedDrugItem);
            this.chooseedDrugInfo = this.chooesedDrugItem;
            this.clearChooseGoods(curRefKey, nextRefkey, curRefname, val);
            this.$nextTick(() => {
                this.$refs.drugTable.bodyWrapper.scrollTop = this.$refs.drugTable.bodyWrapper.scrollHeight;
            });
        },
        //验证是否毒麻药品
        checkIsToxicity(curRefKey, nextRefkey, curRefname, val) {
            if (this.chooesedDrugItem.isToxicity == 1) {
                //判断是否毒麻药品
                this.$confirm(
                    `${this.chooesedDrugItem.itemName} 是毒麻药品且超过最大剂量,请在备注中填写已签字！`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        this.checkExistIncompatible(
                            curRefKey,
                            nextRefkey,
                            curRefname,
                            val
                        );
                    })
                    .catch(() => {
                        this.clearChooseGoods(
                            curRefKey,
                            nextRefkey,
                            curRefname,
                            val
                        );
                    });
            } else {
                this.$confirm(
                    `${this.chooesedDrugItem.itemName} 超过最大剂量,是否确认？`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        this.checkExistIncompatible(
                            curRefKey,
                            nextRefkey,
                            curRefname,
                            val
                        );
                    })
                    .catch(() => {
                        this.clearChooseGoods(
                            curRefKey,
                            nextRefkey,
                            curRefname,
                            val
                        );
                    });
            }
        },
        //验证是否有禁忌商品
        checkExistIncompatible(curRefKey, nextRefkey, curRefname, val) {
            let needSign = false;
            let needSignName = '';
            this.choosedDrugData.forEach(_i => {
                if (_i.isExistIncompatibility) {
                    let relateIncompatibility = [];
                    relateIncompatibility = this.allIncompatibilitys.filter(
                        _c =>
                            (_c.drug1Id == (_i.id || _i.itemId) &&
								_c.drug2Id == this.chooesedDrugItem.itemId) ||
							(_c.drug2Id == (_i.id || _i.itemId) &&
								_c.drug1Id == this.chooesedDrugItem.itemId)
                    ); //有关联禁忌商品
                    relateIncompatibility.forEach(_h => {
                        if (
                            _c =>
                                _c.drug1Id == this.chooesedDrugItem.itemId ||
								_c.drug2Id == this.chooesedDrugItem.itemId
                        ) {
                            this.$set(
                                this.chooesedDrugItem,
                                'incompNeedSign',
                                true
                            );
                            this.$set(_i, 'incompNeedSign', true);
                            needSign = true;
                            needSignName += _i.name;
                        }
                    });
                }
            });
            if (needSign) {
                this.$confirm(
                    `${this.chooesedDrugItem.name}与${needSignName}为禁忌商品,请在备注中填写已签字！`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        this.sureAddGoods(
                            curRefKey,
                            nextRefkey,
                            curRefname,
                            val
                        );
                    })
                    .catch(() => {
                        this.clearChooseGoods(
                            curRefKey,
                            nextRefkey,
                            curRefname,
                            val
                        );
                    });
            } else {
                this.sureAddGoods(curRefKey, nextRefkey, curRefname, val);
            }
        },
        //审核添加商品是否需要签字
        verifyAddGoods(curRefKey, nextRefkey, curRefname, val) {
            if (!this.chooseGoodsForm.drug) {
                this.$message({
                    message: '请选择商品',
                    type: 'warning'
                });
                return;
            }
            if (!this.chooseGoodsForm.qty) {
                this.$message({
                    message: '请输入数量',
                    type: 'warning'
                });
                return;
            }
            let existRepeat = this.choosedDrugData.some(
                h => h.itemId == this.chooesedDrugItem.itemId
            );
            if (existRepeat) {
                this.$message({
                    message: '存在相同药品',
                    type: 'warning'
                });
                this.chooesedDrugItem = {};
                this.clearChooseGoods(curRefKey, nextRefkey, curRefname, val);
                return;
            }
            //判断是否存在于配伍禁忌中
            let isExistIncompatibility = this.allIncompatibilitys.some(_v => {
                return (
                    _v.drug1Id == this.chooesedDrugItem.itemId ||
					_v.drug2Id == this.chooesedDrugItem.itemId
                );
            });
            if (isExistIncompatibility) {
                this.$set(
                    this.chooesedDrugItem,
                    'isExistIncompatibility',
                    true
                );
            }
            //判断是否超出最大剂量  判断最大剂量，用单付重量=数量*重量
            if (
                this.chooseGoodsForm.qty * this.chooesedDrugItem.itemWeight >
				this.chooesedDrugItem.maxQty
            ) {
                this.$set(this.chooesedDrugItem, 'exceedLimit', true);
                this.checkIsToxicity(curRefKey, nextRefkey, curRefname, val);
            } else {
                this.checkExistIncompatible(
                    curRefKey,
                    nextRefkey,
                    curRefname,
                    val
                );
            }
        },
        //获取药品
        getDrugData(value) {
            //'???????????'  处理无输入内容 故意传的，防止单个字母查询时间过长回显
            let params = {
                multiCondition: value || '???????????'
            };
            this.drugLoading = value ? true : false;
            this.$api
                .basic_baseDrugInf_all(params)
                .then(r => {
                    this.durgOptions = r.data.result.sort(function(a, b) {
                        return a.shorthandCode.localeCompare(b.shorthandCode);
                    });
                    this.drugLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.drugLoading = false;
                });
        }
    }
};
</script>
<style lang="scss"   scoped>
.prescribe-enter-container {
	position: relative;
	height: calc(100% - 40px);
	background-color: #fff;
	/deep/ .Pane {
		height: 100%;
	}
	.scancode-dialog {
		>>> .el-table__body tr.current-row > td {
			background: #26baf366;
		}
		/deep/ .el-dialog {
			width: 90%;
			.scancode-container {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				.rt-choose-wrapper {
					flex: 1;
				}
				.lt-operate-wrapper {
					flex: 1;
					min-width: 240px;
					.scancode-form-item {
						.el-form-item__content {
							text-align: center;
						}
					}
				}
			}
			.scancode_area {
				width: 100%;
				align-items: center;
				max-width: 380px;
				margin: auto;
			}
			.scanQRCode {
				width: 200px;
				height: 240px;
			}
		}
	}
	.bg-color-tip {
		margin-left: 50px;
		.label-print {
			margin-right: 20px;
		}
		.bg-tag {
			width: 25px;
			height: 16px;
			border-radius: 5px;
			margin-right: 5px;
			&__nosign {
				background: #f6a4a4;
			}
			&__nocomparison {
				background: #e0d4fb;
			}
			&__repetdrug {
				background: #ffe550;
			}
		}
	}
	/deep/ .no-sign {
		tr,
		td {
			background: #f6a4a4 !important;
		}
	}
	/deep/ .no-comparison {
		tr,
		td {
			background: #e0d4fb !important;
		}
	}
	/deep/ .repet-drug {
		tr,
		td {
			background: #ffe550 !important;
		}
	}
	.el-table .success-row {
		background: #f0f9eb;
	}
	/deep/ .Pane:nth-of-type(1) {
		overflow: visible;
	}
	/deep/ .Resizer {
		z-index: 888;
	}
	/deep/ .form-select-panel {
		width: auto !important;
		.sel-cell {
			display: inline-block;
			text-align: center;
			vertical-align: middle;
		}
	}
	.lt-container {
		position: relative;
		padding: 0 5px 0 3px;
		height: 100%;
		.control-btn {
			position: absolute;
			right: -10px;
			width: 20px;
			height: 20px;
			line-height: 20px;
			top: 10px;
			text-align: center;
			margin: auto;
			cursor: pointer;
			background: #ebeef5;
			z-index: 889;
			border-radius: 10px;
			overflow: hidden;
			box-shadow: 0px 0px 3px 3px #dfe6ec;
			i {
				font-weight: bold;
				font-size: 14px;
			}
		}
	}
	.scanQRCode {
		width: 200px;
		height: 240px;
	}
	.insert-container {
		.opt-btn {
			margin-left: 0px !important;
			margin-right: 0px !important;
			padding: 6px 6px;
		}
		.create-btn {
			background-color: #f8ab6b;
			border-color: #f8ab6b;
		}
		.repeal-btn {
			background-color: #f17f5e;
			border-color: #f17f5e;
		}
		.copy-btn {
			background-color: #c479bf;
			border-color: #c479bf;
		}
		.edit-btn {
			background-color: #72b3f3;
			border-color: #72b3f3;
		}
		.code-btn {
			background-color: #1f9716;
			border-color: #1f9716;
		}

		.history-title {
			line-height: 24px;
			padding: 8px;
			font-size: 14px;
			border-bottom: 1px solid #ccc;
			h6 {
				font-size: 14px;
				display: inline-block;
				margin: 0 20px;
			}
			span {
				margin-right: 30px;
			}
		}
		.mainForm-wrapper {
			padding-top: 5px;

			>>> .custom-form {
				display: flex;
				flex-wrap: wrap;
				.el-form-item {
					margin-bottom: 0px !important;
				}
				.el-form-item__content {
					line-height: 32px;
				}
				.el-form-item__label {
					line-height: 32px;
					font-size: 14px;
					padding: 0 6px 0 0;
				}
				.el-input--mini {
					font-size: 12px !important;
					.el-input__suffix {
						height: 28px;
					}
					.el-form-item__error {
						padding-top: 0px;
					}
				}
				.el-range-editor--mini .el-range-separator {
					width: 30px;
				}
			}
		}
		.total-info-wrapper {
			background: #eef1f6;
			line-height: 24px;
			margin: 5px 10px;
			padding: 5px 10px;
			font-size: 16px;
			font-weight: bold;
			display: flex;
			align-items: center;
			.info {
				display: inline-block;
			}
			.btn-groud {
				display: inline-block;
			}
			.added-drug {
				color: #f56c6c;
				display: inline-block;
				margin-left: 5px;
				font-weight: bold;
				font-size: 15px;
			}
		}
		.filter-goods-wrapper {
			padding: 5px 10px;
			/deep/ .select-panel {
				.el-select-dropdown__item {
					padding: 0px;
				}
				.el-select-dropdown__item.hover {
					background: rgb(236, 245, 255);
				}
				.sel-tr {
					font-size: 0;
					.sel-cell {
						display: inline-block;
						border-bottom: 1px solid #dfe6ec;
						border-right: 1px solid #dfe6ec;
						text-align: center;
						line-height: 34px;
						height: 34px;
						font-size: 14px;
						vertical-align: middle;
					}
				}
			}
			>>> .custom-form {
				display: flex;
				flex-wrap: wrap;

				.el-form-item {
					margin-bottom: 0px !important;
				}
				.el-form-item__content {
					line-height: 32px;
				}
				.el-form-item__label {
					line-height: 32px;
					font-size: 14px;
				}
				.el-input--mini {
					font-size: 12px !important;
					.el-input__suffix {
						height: 28px;
					}
					.el-form-item__error {
						padding-top: 0px;
					}
				}
				.el-range-editor--mini .el-range-separator {
					width: 30px;
				}
			}
		}
		.drug-wrapper {
			margin: 10px 10px 0;
		}
	}
}
.print-container {
	.print-header {
		text-align: center;
		position: relative;
		height: 50px;
		line-height: 50px;
		.print-title {
			padding: 0;
			margin: 0;
		}
		.bar-code {
			position: absolute;
			right: 30px;
			top: 0;
		}
	}
	.patient-info {
		margin-top: 10px;
		margin-bottom: 5px;
		span {
			margin-right: 40px;
		}
	}
	.print-body {
		height: 400px;
		border: 1px solid black;
		display: flex;
		.lt-diagnose {
			width: 10%;
			min-width: 150px;
			border-right: 1px solid #000;
			display: flex;
			flex-direction: column;

			.lt-title {
				text-align: center;
				margin: 0;
				line-height: 24px;
			}
			.diagnose-content {
				display: flex;
				padding-left: 5px;
				flex: 1;
				flex-direction: column;
				justify-content: space-around;
			}
		}
		.rt-drug {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.drugs-content {
				padding-top: 40px;
				padding-left: 5px;
				span {
					display: inline-block;
					width: 22%;
					margin-left: 10px;
					line-height: 25px;
					color: #333;
				}
			}
			.prescribe-info {
				padding: 10px;
				.usage-tip {
					margin: 30px 0;
				}
			}
		}
	}
	.print-footer {
		line-height: 22px;
		padding-right: 30px;
		display: flex;
		justify-content: space-between;
		color: #333;
	}
	.physician-tip {
		line-height: 22px;
		color: #989898;
		margin: 0;
	}
}
</style>
