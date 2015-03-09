<#global DEBUG = false>

<#if DEBUG?? && DEBUG>
    <#global jsRoot = '${ctx}/js'>
    <#global seaRoot = '${ctx}/sea-modules'>
    <#global cssRoot = '${ctx}/css'>
<#else>
    <#global cdn = 'http://ue.17173cdn.com/a/jifen/index/2014'>
    <#global jsRoot = '${cdn}/js'>
    <#global seaRoot = '${cdn}/js'>
    <#global cssRoot = '${cdn}/css'>
</#if>

<#assign version = '20140515140200'>
