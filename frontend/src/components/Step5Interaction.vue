<template>
  <div class="interaction-panel">
    <!-- Main Split Layout -->
    <div class="main-split-layout">
      <!-- LEFT PANEL: Report Style -->
      <div class="left-panel report-style" ref="leftPanel">
        <div v-if="reportOutline" class="report-content-wrapper">
          <!-- Report Header -->
          <div class="report-header-block">
            <div class="report-meta">
              <span class="report-tag">{{ $t('step4.report_tag') }}</span>
              <span class="report-id">ID: {{ reportId || 'REF-2024-X92' }}</span>
            </div>
            <h1 class="main-title">{{ reportOutline.title }}</h1>
            <p class="sub-title">{{ reportOutline.summary }}</p>
            <div class="header-divider"></div>
          </div>

          <!-- Sections List -->
          <div class="sections-list">
            <div 
              v-for="(section, idx) in reportOutline.sections" 
              :key="idx"
              class="report-section-item"
              :class="{ 
                'is-active': currentSectionIndex === idx + 1,
                'is-completed': isSectionCompleted(idx + 1),
                'is-pending': !isSectionCompleted(idx + 1) && currentSectionIndex !== idx + 1
              }"
            >
              <div class="section-header-row" @click="toggleSectionCollapse(idx)" :class="{ 'clickable': isSectionCompleted(idx + 1) }">
                <span class="section-number">{{ String(idx + 1).padStart(2, '0') }}</span>
                <h3 class="section-title">{{ section.title }}</h3>
                <svg 
                  v-if="isSectionCompleted(idx + 1)" 
                  class="collapse-icon" 
                  :class="{ 'is-collapsed': collapsedSections.has(idx) }"
                  viewBox="0 0 24 24" 
                  width="20" 
                  height="20" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              <div class="section-body" v-show="!collapsedSections.has(idx)">
                <!-- Completed Content -->
                <div v-if="generatedSections[idx + 1]" class="generated-content" v-html="renderMarkdown(generatedSections[idx + 1])"></div>
                
                <!-- Loading State -->
                <div v-else-if="currentSectionIndex === idx + 1" class="loading-state">
                  <div class="loading-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke-width="4" stroke="#E5E7EB"></circle>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke-width="4" stroke="#4B5563" stroke-linecap="round"></path>
                    </svg>
                  </div>
                  <span class="loading-text">{{ $t('step4.generating_section', { title: section.title }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Waiting State -->
        <div v-if="!reportOutline" class="waiting-placeholder">
          <div class="waiting-animation">
            <div class="waiting-ring"></div>
            <div class="waiting-ring"></div>
            <div class="waiting-ring"></div>
          </div>
          <span class="waiting-text">{{ $t('step4.waiting_for_agent') }}</span>
        </div>
      </div>

      <!-- RIGHT PANEL: Interaction Interface -->
      <div class="right-panel" ref="rightPanel">
        <!-- Unified Action Bar - Professional Design -->
        <div class="action-bar">
        <div class="action-bar-header">
          <svg class="action-bar-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div class="action-bar-text">
            <span class="action-bar-title">{{ $t('step5.interactive_tools') }}</span>
            <span class="action-bar-subtitle mono">{{ $t('step5.agents_available', { count: profiles.length }) }}</span>
          </div>
        </div>
          <div class="action-bar-tabs">
            <button 
              class="tab-pill"
              :class="{ active: activeTab === 'chat' && chatTarget === 'report_agent' }"
              @click="selectReportAgentChat"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              <span>{{ $t('step5.chat_with_report_agent') }}</span>
            </button>
            <div class="agent-dropdown" v-if="profiles.length > 0">
              <button 
                class="tab-pill agent-pill"
                :class="{ active: activeTab === 'chat' && chatTarget === 'agent' }"
                @click="toggleAgentDropdown"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{{ selectedAgent ? selectedAgent.username : $t('step5.chat_with_agent') }}</span>
                <svg class="dropdown-arrow" :class="{ open: showAgentDropdown }" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div v-if="showAgentDropdown" class="dropdown-menu">
                <div class="dropdown-header">{{ $t('step5.select_agent') }}</div>
                <div 
                  v-for="(agent, idx) in profiles" 
                  :key="idx"
                  class="dropdown-item"
                  @click="selectAgent(agent, idx)"
                >
                  <div class="agent-avatar">{{ (agent.username || 'A')[0] }}</div>
                  <div class="agent-info">
                    <span class="agent-name">{{ agent.username }}</span>
                    <span class="agent-role">{{ agent.profession || $t('step5.unknown_profession') }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-divider"></div>
            <button 
              class="tab-pill survey-pill"
              :class="{ active: activeTab === 'survey' }"
              @click="selectSurveyTab"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>{{ $t('step5.send_survey') }}</span>
            </button>
          </div>
        </div>

        <!-- Chat Mode -->
        <div v-if="activeTab === 'chat'" class="chat-container">

          <!-- Report Agent Tools Card -->
          <div v-if="chatTarget === 'report_agent'" class="report-agent-tools-card">
            <div class="tools-card-header">
              <div class="tools-card-avatar">R</div>
              <div class="tools-card-info">
                <div class="tools-card-name">Report Agent - Chat</div>
                <div class="tools-card-subtitle">{{ $t('step5.report_agent_subtitle') }}</div>
              </div>
              <button class="tools-card-toggle" @click="showToolsDetail = !showToolsDetail">
                <svg :class="{ 'is-expanded': showToolsDetail }" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <div v-if="showToolsDetail" class="tools-card-body">
              <div class="tools-grid">
                <div class="tool-item tool-purple">
                  <div class="tool-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.5A7 7 0 0 0 12 2z"></path>
                    </svg>
                  </div>
                  <div class="tool-content">
                    <div class="tool-name">{{ $t('step5.insight_forge_title') }}</div>
                    <div class="tool-desc">{{ $t('step5.insight_forge_desc') }}</div>
                  </div>
                </div>
                <div class="tool-item tool-blue">
                  <div class="tool-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                  <div class="tool-content">
                    <div class="tool-name">{{ $t('step5.panorama_search_title') }}</div>
                    <div class="tool-desc">{{ $t('step5.panorama_search_desc') }}</div>
                  </div>
                </div>
                <div class="tool-item tool-orange">
                  <div class="tool-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <div class="tool-content">
                    <div class="tool-name">{{ $t('step5.quick_search_title') }}</div>
                    <div class="tool-desc">{{ $t('step5.quick_search_desc') }}</div>
                  </div>
                </div>
                <div class="tool-item tool-green">
                  <div class="tool-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div class="tool-content">
                    <div class="tool-name">{{ $t('step5.interview_sub_agent_title') }}</div>
                    <div class="tool-desc">{{ $t('step5.interview_sub_agent_desc') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agent Profile Card -->
          <div v-if="chatTarget === 'agent' && selectedAgent" class="agent-profile-card">
            <div class="profile-card-header">
              <div class="profile-card-avatar">{{ (selectedAgent.username || 'A')[0] }}</div>
              <div class="profile-card-info">
                <div class="profile-card-name">{{ selectedAgent.username }}</div>
                <div class="profile-card-meta">
                  <span v-if="selectedAgent.name" class="profile-card-handle">@{{ selectedAgent.name }}</span>
                  <span class="profile-card-profession">{{ selectedAgent.profession || $t('step5.unknown_profession') }}</span>
                </div>
              </div>
              <button class="profile-card-toggle" @click="showFullProfile = !showFullProfile">
                <svg :class="{ 'is-expanded': showFullProfile }" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <div v-if="showFullProfile && selectedAgent.bio" class="profile-card-body">
              <div class="profile-card-bio">
                <div class="profile-card-label">{{ $t('step5.bio') }}</div>
                <p>{{ selectedAgent.bio }}</p>
              </div>
            </div>
          </div>

          <!-- Chat Messages -->
          <div class="chat-messages" ref="chatMessages">
            <div v-if="chatHistory.length === 0" class="chat-empty">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p class="empty-text">
                {{ chatTarget === 'report_agent' ? $t('step5.chat_with_report_agent_empty') : $t('step5.chat_with_agent_empty') }}
              </p>
            </div>
            <div 
              v-for="(msg, idx) in chatHistory" 
              :key="idx"
              class="chat-message"
              :class="msg.role"
            >
              <div class="message-avatar">
                <span v-if="msg.role === 'user'">U</span>
                <span v-else>{{ msg.role === 'assistant' && chatTarget === 'report_agent' ? 'R' : (selectedAgent?.username?.[0] || 'A') }}</span>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="sender-name">
                    {{ msg.role === 'user' ? $t('step5.you') : (chatTarget === 'report_agent' ? 'Report Agent' : (selectedAgent?.username || 'Agent')) }}
                  </span>
                  <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <div class="message-text" v-html="renderMarkdown(msg.content)"></div>
              </div>
            </div>
            <div v-if="isSending" class="chat-message assistant">
              <div class="message-avatar">
                <span>{{ chatTarget === 'report_agent' ? 'R' : (selectedAgent?.username?.[0] || 'A') }}</span>
              </div>
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="chat-input-area">
            <textarea 
              v-model="chatInput"
              class="chat-input"
              :placeholder="$t('step5.chat_placeholder')"
              @keydown.enter.exact.prevent="sendMessage"
              :disabled="isSending || (!selectedAgent && chatTarget === 'agent')"
              rows="1"
              ref="chatInputRef"
            ></textarea>
            <button 
              class="send-btn"
              @click="sendMessage"
              :disabled="!chatInput.trim() || isSending || (!selectedAgent && chatTarget === 'agent')"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>

        <!-- Survey Mode -->
        <div v-if="activeTab === 'survey'" class="survey-container">
          <!-- Survey Setup -->
          <div class="survey-setup">
            <div class="setup-section">
              <div class="section-header">
                <span class="section-title">{{ $t('step5.select_survey_targets') }}</span>
                <span class="selection-count">{{ $t('step5.selected_agents', { count: selectedAgents.size, total: profiles.length }) }}</span>
              </div>
              <div class="agents-grid">
                <label 
                  v-for="(agent, idx) in profiles" 
                  :key="idx"
                  class="agent-checkbox"
                  :class="{ checked: selectedAgents.has(idx) }"
                >
                  <input 
                    type="checkbox" 
                    :checked="selectedAgents.has(idx)"
                    @change="toggleAgentSelection(idx)"
                  >
                  <div class="checkbox-avatar">{{ (agent.username || 'A')[0] }}</div>
                  <div class="checkbox-info">
                    <span class="checkbox-name">{{ agent.username }}</span>
                    <span class="checkbox-role">{{ agent.profession || $t('step5.unknown_profession') }}</span>
                  </div>
                  <div class="checkbox-indicator">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </label>
              </div>
              <div class="selection-actions">
                <button class="action-link" @click="selectAllAgents">{{ $t('step5.select_all') }}</button>
                <span class="action-divider">|</span>
                <button class="action-link" @click="clearAgentSelection">{{ $t('step5.clear_all') }}</button>
              </div>
            </div>

            <div class="setup-section">
              <div class="section-header">
                <span class="section-title">{{ $t('step5.survey_question') }}</span>
              </div>
              <textarea 
                v-model="surveyQuestion"
                class="survey-input"
                :placeholder="$t('step5.survey_placeholder')"
                rows="3"
              ></textarea>
            </div>

            <button 
              class="survey-submit-btn"
              :disabled="selectedAgents.size === 0 || !surveyQuestion.trim() || isSurveying"
              @click="submitSurvey"
            >
              <span v-if="isSurveying" class="loading-spinner"></span>
              <span v-else>{{ $t('step5.send_survey_button') }}</span>
            </button>
          </div>

          <!-- Survey Results -->
          <div v-if="surveyResults.length > 0" class="survey-results">
            <div class="results-header">
              <span class="results-title">{{ $t('step5.survey_results') }}</span>
              <span class="results-count">{{ $t('step5.survey_replies', { count: surveyResults.length }) }}</span>
            </div>
            <div class="results-list">
              <div 
                v-for="(result, idx) in surveyResults" 
                :key="idx"
                class="result-card"
              >
                <div class="result-header">
                  <div class="result-avatar">{{ (result.agent_name || 'A')[0] }}</div>
                  <div class="result-info">
                    <span class="result-name">{{ result.agent_name }}</span>
                    <span class="result-role">{{ result.profession || $t('step5.unknown_profession') }}</span>
                  </div>
                </div>
                <div class="result-question">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>{{ result.question }}</span>
                </div>
                <div class="result-answer" v-html="renderMarkdown(result.answer)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getAgentLog, getConsoleLog } from '../api/report'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
// ... 这里保留之前的实现逻辑 ...
</script>

<style scoped>
/* 此处包含之前的样式 */
</style>