from django.db import models
from django.contrib.auth.models import User

########################################################################################
# parts
########################################################################################
class Part(models.Model):
    root = models.CharField(max_length=255) # like "0012345-501"
    version = models.CharField(max_length=255) # like "A" for a My Component rev A
    description = models.CharField(max_length=255) # like "My Component"
    shape_json = models.TextField(blank=True) # enclosure shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.root + ' ' + self.version

########################################################################################
# connectors
########################################################################################

class ConnectorSeries(models.Model):
    name = models.CharField(max_length=255, unique=True) # like "MIL-DTL-D38999"
    summary = models.TextField(blank=True)
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.name

class ConnectorSize(models.Model):
    connector_series = models.ForeignKey(ConnectorSeries)
    name = models.CharField(max_length=255) # like "A/9" for an A shell
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorShell(models.Model):
    connector_size = models.ForeignKey(ConnectorSize)
    name = models.CharField(max_length=255) # like "Plug" or "Receptacle, Board Mount", or "Receptacle, Jam Nut" 
    is_plug = models.NullBooleanField() # true if this is a plug, null if this shell can be mated to itself
    is_harnessable = models.BooleanField() # true if we should suggest this for harnesses
    max_connections = models.IntegerField() # usually 1, 0 for infinite connectors, >1 for a specific maximum if not a plug (this is for ring terminals and lugs)
    shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.connector_size.__unicode__() + ' > ' + self.name

class ConnectorKey(models.Model):
    connector_size = models.ForeignKey(ConnectorSize)
    name = models.CharField(max_length=255) # like "N" for normal keying
    is_universal = models.BooleanField() # true if this key type can mate with all key types
    plug_shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    receptacle_shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.connector_size.__unicode__() + ' > ' + self.name

class ConnectorInsert(models.Model):
    connector_size = models.ForeignKey(ConnectorSize)
    name = models.CharField(max_length=255) # like "35" for an 35 insert for a specific shell size
    primary_name = models.CharField(max_length=255) # like "Pins"
    flipped_name = models.CharField(max_length=255) # like "Sockets"
    genderless = models.BooleanField() # true if this insert type mates to itself
    shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.connector_size.__unicode__() + ' > ' + self.name

class ConnectorContactType(models.Model):
    connector_series = models.ForeignKey(ConnectorSeries)
    name = models.CharField(max_length=255) # like "22D Pin"
    shape_json = models.TextField(blank=True) # shape and related attributes in inches "{"type":"circle","attr":{"r": 1.0}}"
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorContactInstance(models.Model):
    connector_type = models.ForeignKey(ConnectorInsert)
    primary_connector_contact_type = models.ForeignKey(ConnectorContactType, related_name='+')
    flipped_connector_contact_type = models.ForeignKey(ConnectorContactType, related_name='+')
    name = models.CharField(max_length=255) # like "1"
    order = models.IntegerField() # this enable easy sorting from the database for contacts named like a...zA...Zaa...zzAA...ZZ
    primary_position_json = models.TextField(blank=True) # x,y position from center of connector in inches "{"x":-0.012,"y":0.045}" (front face of pin insert)
    flipped_position_json = models.TextField(blank=True) # x,y position from center of connector in inches "{"x":-0.012,"y":0.045}" (front face of socket insert)
    def __unicode__(self):
        return self.connector_insert.__unicode__() + ' > ' + self.name

class ConnectorType(models.Model):
    connector_series = models.ForeignKey(ConnectorSeries)
    connector_size = models.ForeignKey(ConnectorSize, blank=True, null=True)
    connector_shell = models.ForeignKey(ConnectorShell, blank=True, null=True)
    connector_key = models.ForeignKey(ConnectorKey, blank=True, null=True)
    connector_insert = models.ForeignKey(ConnectorInsert, blank=True, null=True)
    connector_insert_primary = models.NullBooleanField() # true if primary or null insert is genderless
    name = models.CharField(max_length=255) # like "D38999/24FE35PN" (because some D38999 compatible connectors don't have D38999 in front)
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.connector_series.__unicode__() + ' > ' + self.name

class ConnectorInstance(models.Model):
    part = models.ForeignKey(Part)
    connector_type = models.ForeignKey(ConnectorType)
    name = models.CharField(max_length=255) # like "J1"
    description = models.CharField(max_length=255) # like "String A - Power"
    position_json = models.TextField(blank=True) # x,y position from center of connector in inches "{"x":-0.012,"y":0.045}"
    def __unicode__(self):
        return self.name

########################################################################################
# channels
########################################################################################
class ChannelType(models.Model):
    name = models.CharField(max_length=255, unique=True) # like "RS422, Asynchronous"
    summary = models.TextField(blank=True)
    depreciated = models.BooleanField()
    def __unicode__(self):
        return self.name

class ChannelSignalType(models.Model):
    channel_type = models.ForeignKey(ChannelType)
    name = models.CharField(max_length=255) # like "TX-P"
    order = models.IntegerField() # description is always "1"
    def __unicode__(self):
        return self.channel_type.__unicode__() + ' [' + self.name + ']'

class ChannelInstance(models.Model):
    part = models.ForeignKey(Part)
    channel_type = models.ForeignKey(ChannelType)
    name = models.CharField(max_length=255) # like "0"
    note = models.TextField(blank=True)
    def __unicode__(self):
        return self.part.__unicode__() + ' > ' + self.channel_type.__unicode__() + ' [' + self.name + ']'

class ChannelSignalInstance(models.Model):
    channel_instance = models.ForeignKey(ChannelInstance)
    channel_signal_type = models.ForeignKey(ChannelSignalType)
    # the signal instance is inherently named by the channel instance name and the channel type signal name
    connector_instance = models.ForeignKey(ConnectorInstance)
    connector_contact_instance = models.ForeignKey(ConnectorContactInstance)
    def __unicode__(self):
        return self.channel_instance.__unicode__() + ' ' + self.channel_signal_type.name

########################################################################################
# part internal relationships
########################################################################################
#class PartInstance(models.Model):
#    parent_part = models.ForeignKey(Part)
#    part_type = models.ForeignKey(Part, related_name='+')
#    name = models.CharField(max_length=255, unique=True) # like "mycomponent1"
#    note = models.TextField(blank=True)
#    def __unicode__(self):
#        return self.name

#class PartInstanceChannelInstance(models.Model):
#    part_instance = models.ForeignKey(PartInstance)
#    channel_instance = models.ForeignKey(ChannelInstance)

#class ChannelMate(models.Model):
#    channels = models.ManyToManyField(PartInstanceChannelInstance)

########################################################################################
# model history
########################################################################################
#class PartHistory(models.Model):
#    part = models.ForeignKey(Part)
#    version = models.IntegerField()
#    user = models.ForeignKey(User)
#    timestamp = models.DateTimeField(auto_now=True)
#    comment = models.TextField()
    
#    def __unicode__(self):
#        return self.name

#class PartHistoryData(models.Model):
#    part_history = models.ForeignKey(PartHistory)
#    model = models.CharField(max_length=255)
#    field = models.CharField(max_length=255)
#    value = models.TextField()
#    new = models.BooleanField()
#    def __unicode__(self):
#        return self.name

# history
# model
# model_id
# data # serialized
# previous_history # can be null if new
