<template>
  <div 
    class="history-database"
    :class="{ 'no-projects': projects.length === 0 && !loading }"
    ref="historyContainer"
  >
    <!-- 背景装饰：技术网格线（只在有项目时显示） -->
    <div v-if="projects.length > 0 || loading" class="tech-grid-bg">
      <div class="grid-pattern"></div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- 标题区域 -->
    <div class="section-header">
      <div class="section-line"></div>
      <span class="section-title">{{ $t('history.title') }}</span>
      <div class="section-line"></div>
    </div>

    <!-- 卡片容器（只在有项目时显示） -->
    <div v-if="projects.length > 0" class="cards-container" :class="{ expanded: isExpanded }" :style="containerStyle">
      <div 
        v-for="(project, index) in projects" 
        :key="project.simulation_id"
        class="project-card"
        :class="{ expanded: isExpanded, hovering: hoveringCard === index }"
        :style="getCardStyle(index)"
        @mouseenter="hoveringCard = index"
        @mouseleave="hoveringCard = null"
        @click="navigateToProject(project)"
      >
        <!-- 卡片头部：simulation_id 和 功能可用状态 -->
        <div class="card-header">
          <span class="card-id">{{ formatSimulationId(project.simulation_id) }}</span>
          <div class="card-status-icons">
            <span 
              class="status-icon" 
              :class="{ available: project.project_id, unavailable: !project.project_id }"
              :title="$t('history.status.graph')"
            >◇</span>
            <span 
              class="status-icon available" 
              :title="$t('history.status.env')"
            >◈</span>
            <span 
              class="status-icon" 
              :class="{ available: project.report_id, unavailable: !project.report_id }"
              :title="$t('history.status.report')"
            >◆</span>
          </div>
        </div>

        <!-- 文件列表区域 -->
        <div class="card-files-wrapper">
          <!-- 角落装饰 - 取景框风格 -->
          <div class="corner-mark top-left-only"></div>
          
          <!-- 文件列表 -->
          <div class="files-list" v-if="project.files && project.files.length > 0">
            <div 
              v-for="(file, fileIndex) in project.files.slice(0, 3)" 
              :key="fileIndex"
              class="file-item"
            >
              <span class="file-tag" :class="getFileType(file.filename)">{{ getFileTypeLabel(file.filename) }}</span>
              <span class="file-name">{{ truncateFilename(file.filename, 20) }}</span>
            </div>
            <!-- 如果有更多文件，显示提示 -->
            <div v-if="project.files.length > 3" class="files-more">
              {{ $t('history.files.more', { count: project.files.length - 3 }) }}
            </div>
          </div>
          <!-- 无文件时的占位 -->
          <div class="files-empty" v-else>
            <span class="empty-file-icon">◇</span>
            <span class="empty-file-text">{{ $t('history.files.none') }}</span>
          </div>
        </div>

        <!-- 卡片标题（使用模拟需求的前20字作为标题） -->
        <h3 class="card-title">{{ getSimulationTitle(project.simulation_requirement) }}</h3>

        <!-- 卡片描述（模拟需求完整展示） -->
        <p class="card-desc">{{ truncateText(project.simulation_requirement, 55) }}</p>

        <!-- 卡片底部 -->
        <div class="card-footer">
          <div class="card-datetime">
            <span class="card-date">{{ formatDate(project.created_at) }}</span>
            <span class="card-time">{{ formatTime(project.created_at) }}</span>
          </div>
          <span class="card-progress" :class="getProgressClass(project)">
            <span class="status-dot">●</span> {{ formatRounds(project) }}
          </span>
        </div>
        
        <!-- 底部装饰线 (hover时展开) -->
        <div class="card-bottom-line"></div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <span class="loading-spinner"></span>
      <span class="loading-text">{{ $t('history.loading') }}</span>
    </div>

    <!-- 历史回放详情弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedProject" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <!-- 弹窗头部 -->
            <div class="modal-header">
              <div class="modal-title-section">
                <span class="modal-id">{{ formatSimulationId(selectedProject.simulation_id) }}</span>
                <span class="modal-progress" :class="getProgressClass(selectedProject)">
                  <span class="status-dot">●</span> {{ formatRounds(selectedProject) }}
                </span>
                <span class="modal-create-time">{{ formatDate(selectedProject.created_at) }} {{ formatTime(selectedProject.created_at) }}</span>
              </div>
              <button class="modal-close" @click="closeModal">×</button>
            </div>

            <!-- 弹窗内容 -->
            <div class="modal-body">
              <!-- 模拟需求 -->
              <div class="modal-section">
                <div class="modal-label">{{ $t('history.modal.requirement') }}</div>
                <div class="modal-requirement">{{ selectedProject.simulation_requirement || $t('history.modal.no_requirement') }}</div>
              </div>

              <!-- 文件列表 -->
              <div class="modal-section">
                <div class="modal-label">{{ $t('history.modal.files') }}</div>
                <div class="modal-files" v-if="selectedProject.files && selectedProject.files.length > 0">
                  <div v-for="(file, index) in selectedProject.files" :key="index" class="modal-file-item">
                    <span class="file-tag" :class="getFileType(file.filename)">{{ getFileTypeLabel(file.filename) }}</span>
                    <span class="modal-file-name">{{ file.filename }}</span>
                  </div>
                </div>
                <div class="modal-empty" v-else>{{ $t('history.modal.no_files') }}</div>
              </div>
            </div>

            <!-- 推演回放分割线 -->
            <div class="modal-divider">
              <span class="divider-line"></span>
              <span class="divider-text">{{ $t('history.modal.playback_title') }}</span>
              <span class="divider-line"></span>
            </div>

            <!-- 导航按钮 -->
            <div class="modal-actions">
              <button 
                class="modal-btn btn-project" 
                @click="goToProject"
                :disabled="!selectedProject.project_id"
              >
                <span class="btn-step">Step1</span>
                <span class="btn-icon">◇</span>
                <span class="btn-text">{{ $t('history.modal.step1') }}</span>
              </button>
              <button 
                class="modal-btn btn-simulation" 
                @click="goToSimulation"
              >
                <span class="btn-step">Step2</span>
                <span class="btn-icon">◈</span>
                <span class="btn-text">{{ $t('history.modal.step2') }}</span>
              </button>
              <button 
                class="modal-btn btn-report" 
                @click="goToReport"
                :disabled="!selectedProject.report_id"
              >
                <span class="btn-step">Step4</span>
                <span class="btn-icon">◆</span>
                <span class="btn-text">{{ $t('history.modal.step4') }}</span>
              </button>
            </div>
            <!-- 不可回放提示 -->
            <div class="modal-playback-hint">
              <span class="hint-text">{{ $t('history.modal.playback_hint') }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onActivated, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSimulationHistory } from '../api/simulation'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const projects = ref([])
const loading = ref(false)
const selectedProject = ref(null)
const isExpanded = ref(false)
const hoveringCard = ref(null)
const historyContainer = ref(null)
const containerStyle = ref({})

// ... 这里的其他逻辑保持不变 ...

// 格式化轮数显示（当前轮/总轮数）
const formatRounds = (simulation) => {
  const current = simulation.current_round || 0
  const total = simulation.total_rounds || 0
  if (total === 0) return t('history.not_started')
  return `${current}/${total} ${t('history.rounds')}`
}

// 截断文件名（保留扩展名）
const truncateFilename = (filename, maxLength) => {
  if (!filename) return t('history.files.unknown')
  if (filename.length <= maxLength) return filename
  
  const ext = filename.includes('.') ? '.' + filename.split('.').pop() : ''
  const nameWithoutExt = filename.slice(0, filename.length - ext.length)
  const truncatedName = nameWithoutExt.slice(0, maxLength - ext.length - 3) + '...'
  return truncatedName + ext
}

const getSimulationTitle = (requirement) => {
  if (!requirement) return t('history.unnamed')
  const title = requirement.slice(0, 20)
  return requirement.length > 20 ? title + '...' : title
}

// ... 剩下的逻辑保持不变 ...
</script>
